const PERIODS = ['month', 'day', 'hour', 'minute', 'second'] as const; // sorted long to short
export type RateLimitPeriod = (typeof PERIODS)[number];
export type RateLimitPeriodUsages = Partial<Record<RateLimitPeriod, number>>;
export type RateLimits = RateLimitPeriodUsages & { parallel?: number };

export enum Priority {
    LOW = 'low',
    HIGH = 'high',
}

// Note: we base our calculations on UNIX time, and thus don't have to mind leap seconds.
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const PERIOD_DURATION = {
    second: ONE_SECOND,
    minute: ONE_MINUTE,
    hour: ONE_HOUR,
    day: ONE_DAY,
} as const;

export class RateLimitScheduler {
    private _rateLimits: RateLimits;
    // Track usages for all periods, regardless of what's limited by current _rateLimits, as _rateLimits can be updated.
    private readonly _usages: Required<RateLimits>;
    private readonly _periodResetTimes: Record<RateLimitPeriod, number>;
    private readonly _periodResetSafetyBuffer: number;
    private _pausedUntil = -1;
    private _timer: ReturnType<typeof setTimeout> | undefined;
    private readonly _taskQueue: Array<() => Promise<void>> = [];

    /**
     * Create a scheduler for given rate limits. Limits can be specified for various time periods and for the maximum
     * allowed parallel tasks, and can be arbitrarily combined. Limits of 0 and unspecified limits are interpreted as
     * infinite / unrestricted. If the allowance for at least one limit is exceeded, a task is considered rate-limited
     * and postponed until the rate limit is not exceeded anymore.
     * The time periods are not rolling periods counting requests within the exact time period ending at the current
     * moment, but are fixed periods that start / end at fixed times based on the system time, with the first periods
     * starting at the UNIX epoch, i.e. the days reset at midnight UTC, hours at the full hour etc.
     * To account for the async nature of tasks (as the time when a tasks is processed, for example a web request by a
     * server, might fall already into a different time period than when it was started by the scheduler), or for clock
     * differences between the server's clock and the system's clock, a safety buffer around the original period reset
     * times can be configured during which no tasks should be run to reduce chances that a period has already or has
     * not yet reset on the server, while we would have expected it to not yet or already do. This can be used to avoid,
     * on a best effort basis, for example that tasks we issue at the end of a second are processed by a server already
     * in the next second, such that the rate limit in the new second will be hit earlier than expected, or as another
     * example that we already issue new tasks thinking that a rate limited period has reset while it has not yet on the
     * server, which then rejects those requests.
     */
    constructor(rateLimits: RateLimits, periodResetSafetyBuffer = 0) {
        this._rateLimits = { ...rateLimits }; // create a copy
        this._periodResetSafetyBuffer = periodResetSafetyBuffer;
        this._usages = { parallel: 0 } as typeof this._usages;
        this._periodResetTimes = {} as typeof this._periodResetTimes;
        const now = Date.now();
        for (const period of PERIODS) {
            this._usages[period] = 0;
            this._periodResetTimes[period] = this._calculatePeriodResetTime(period, now);
        }
    }

    /**
     * Change the scheduler's rate limits, see @constructor. Note that this affects future tasks and tasks currently in
     * the queue but not past tasks that were already run.
     */
    public setRateLimits(rateLimits: RateLimits) {
        this._rateLimits = { ...rateLimits }; // create a copy
        // Evaluate new rate limits, which potentially allow starting additional tasks.
        this._startTasks();
    }

    public getRateLimits(): RateLimits {
        // Return a copy
        return { ...this._rateLimits };
    }

    /**
     * Apply known usages, if such have for example been persisted or are reported by an API. Setting the count of
     * currently running parallel tasks is not allowed. Be aware that this might still result in the scheduler's usages
     * being out of sync due to race conditions, for example if the scheduler ran additional tasks while the server was
     * reporting its usage stats.
     * Note that this affects future tasks and tasks currently in the queue but not past tasks that were already run.
     */
    public setUsages(usages: RateLimitPeriodUsages) {
        this._updatePeriods();
        // Set the usages for periods that were passed, and constrain usages for all periods for consistency. Set usages
        // of longer periods are at least as high as those of shorter usages, and usages of shorter periods are at most
        // as high as those of longer periods. If the passed usages are inconsistent, we prioritize the minimums over
        // the maximums, i.e. we assume higher usages.
        const minimums = {} as Record<RateLimitPeriod, number>;
        const maximums = {} as Record<RateLimitPeriod, number>;
        for (let i = PERIODS.length - 1; i >= 0; --i) {
            // Iterate from short periods to long periods to establish minimum values for each period.
            const period = PERIODS[i];
            const shorterPeriod = PERIODS[i + 1] ?? PERIODS[PERIODS.length - 1];
            minimums[period] = Math.max(
                usages[period] ?? 0,
                minimums[shorterPeriod] ?? 0,
            );
        }
        for (let i = 0; i < PERIODS.length; ++i) {
            // Iterate from long periods to short periods to establish maximum values for each period.
            const period = PERIODS[i];
            const longerPeriod = PERIODS[i - 1] ?? PERIODS[0];
            maximums[period] = Math.min(
                usages[period] ?? Number.POSITIVE_INFINITY,
                maximums[longerPeriod] ?? Number.POSITIVE_INFINITY,
            );
        }
        // Set and constrain usages.
        for (const period of PERIODS) {
            // For inconsistent usages, prioritize minimums, see above.
            this._usages[period] = Math.max(
                minimums[period],
                Math.min(
                    maximums[period],
                    usages[period] ?? this._usages[period],
                ),
            );
        }
        // Evaluate new usages, which potentially allow starting additional tasks.
        this._startTasks();
    }

    public getUsages(): Required<RateLimits> {
        // Return a copy
        return { ...this._usages };
    }

    /**
     * Notify the scheduler that a rate limit was hit. This can for example happen for rate limited web requests, where
     * the system clock differs from the server clock, or if other code or tabs also issue requests, independent of this
     * scheduler instance, or if the scheduler's rate limits don't match the server's rate limits.
     */
    public triggerRateLimit(period: RateLimitPeriod) {
        const rateLimit = this._rateLimits[period];
        if (!rateLimit) return; // The period is not rate limited.
        const newUsage = Math.max(rateLimit, this._usages[period]);
        this.setUsages({ [period]: newUsage });
    }

    /**
     * Pause execution of tasks for given duration in ms.
     */
    public pause(duration: number) {
        const pauseUntil = Date.now() + duration;
        if (pauseUntil <= this._pausedUntil) return; // Preserve longer pause.
        this._pausedUntil = pauseUntil;
        // Re-schedule tasks to resume after the pause.
        this._startTasks();
    }

    /**
     * Schedule a task to run as soon as the rate limits allow. The method resolves or rejects with the task's result,
     * once it ran.
     */
    public async schedule<T>(task: () => T, priority = Priority.LOW): Promise<T> {
        return new Promise((resolve, reject) => {
            const asyncTask = async () => {
                try {
                    resolve(await task());
                } catch (e) {
                    reject(e);
                }
            };
            if (priority === Priority.LOW) {
                this._taskQueue.push(asyncTask);
            } else {
                this._taskQueue.unshift(asyncTask);
            }
            this._startTasks();
        });
    }

    // This method is by design not async, to avoid parallel execution and race conditions. Recursive execution is ok.
    private _startTasks() {
        if (this._timer) {
            // Stop existing timer, to avoid accumulation of timers that are obsolete, duplicate or overruled. If a
            // timer needs to be active, it will be set again below.
            clearTimeout(this._timer);
        }

        const now = Date.now();
        this._updatePeriods(now);

        while (this._taskQueue.length) {
            // Note: undefined and 0 rate limits are interpreted as infinite.
            if (this._usages.parallel >= (this._rateLimits.parallel || Number.POSITIVE_INFINITY)) {
                // No further tasks possible regardless of other rate limits. They're started again when a task ends.
                return;
            }
            if (now < this._pausedUntil) {
                // Pause tasks regardless of other usage based rate limits, which is why this has priority over those.
                this._timer = setTimeout(() => this._startTasks(), this._pausedUntil - now);
                return;
            }
            const longestRestrictedTimePeriod = PERIODS.find((period) => {
                const rateLimit = this._rateLimits[period];
                if (!rateLimit) return false; // Period not restricted
                // Test for >= because running an additional task would hit the rate limit, even if it wasn't hit yet.
                const isRateLimitExceeded = this._usages[period] >= rateLimit;
                // If we're within the safety buffer before or after the original period reset time, pause tasks until
                // after the buffer. As we delay the period reset times by the buffer, see _calculatePeriodResetTime,
                // the start of the safety buffer before the original period reset time is the delayed reset time minus
                // twice the buffer and the end of the safety buffer after the original period reset time is the delayed
                // period reset time, which is the time we pause until.
                const isInSafetyBuffer = now >= this._periodResetTimes[period] - 2 * this._periodResetSafetyBuffer;
                return isRateLimitExceeded || isInSafetyBuffer;
            });
            if (longestRestrictedTimePeriod) {
                // Pause tasks until the period resets that hit the rate limit or was restricted by the safety buffer.
                this._timer = setTimeout(
                    () => this._startTasks(),
                    this._periodResetTimes[longestRestrictedTimePeriod] - now,
                );
                return;
            }

            // Run a task.
            this._usages.parallel += 1;
            for (const period of PERIODS) {
                this._usages[period] += 1;
            }
            const task = this._taskQueue.shift()!;
            // Run tasks in parallel, without awaiting them here.
            task().finally(() => {
                this._usages.parallel = Math.max(0, this._usages.parallel - 1);
                // Evaluate reduced parallel task count, which potentially allows starting additional tasks.
                this._startTasks();
            });
        }
    }

    private _updatePeriods(now = Date.now()) {
        for (const period of PERIODS) {
            if (now < this._periodResetTimes[period]) continue;
            this._usages[period] = 0;
            this._periodResetTimes[period] = this._calculatePeriodResetTime(period, now);
        }
    }

    private _calculatePeriodResetTime(period: RateLimitPeriod, now = Date.now()): number {
        // The original reset time is the reset time without applying the reset safety buffer. The returned reset time
        // is delayed by the safety buffer because we want the next period to be usable only after the safety buffer
        // after the original reset time passed. The safety buffer before the original reset time is taken care of in
        // _startTasks.
        let originalResetTime: number;
        // Because we delay the reset time, we have to shift the now time by he delay when calculating the original
        // reset time, to correctly identify the period now should fall into when applying the delay, either still the
        // delayed previous period, or already the next period after the delay.
        now -= this._periodResetSafetyBuffer;
        if (period === 'month') {
            // Calculate start of next month
            const date = new Date(now);
            originalResetTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1); // can overflow to next year
        } else {
            const periodDuration = PERIOD_DURATION[period];
            originalResetTime = (Math.floor(now / periodDuration) + 1) * periodDuration;
        }
        return originalResetTime + this._periodResetSafetyBuffer;
    }
}
