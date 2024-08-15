/**
 * @jest-environment node
 */

/* global jest, beforeEach, afterEach, describe, it */

import { RateLimitScheduler, RateLimits } from '../src/main';

// Clear any remaining timeouts after each test.
let timeoutSpy: jest.SpyInstance;
beforeEach(() => {
    timeoutSpy = jest.spyOn(globalThis, 'setTimeout');
});
afterEach(() => {
    for (const { value: timeout } of timeoutSpy.mock.results) {
        clearInterval(timeout);
    }
    timeoutSpy.mockRestore();
});

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

type SchedulerSetupOptions<AutoResolveTasks extends boolean> = {
    autoResolveTasks?: AutoResolveTasks,
    periodResetSafetyBuffer?: number,
};
type SchedulerSetup<IncludeTaskResolvers extends boolean> = {
    scheduler: RateLimitScheduler,
    task: () => void,
    taskExecutions: number,
} & (IncludeTaskResolvers extends true ? {
    taskResolvers: Array<() => void>,
} : Record<never, never>);
async function setupScheduler(limits: RateLimits, taskCount: number, options?: SchedulerSetupOptions<true>)
    : Promise<SchedulerSetup<false>>;
async function setupScheduler(limits: RateLimits, taskCount: number, options?: SchedulerSetupOptions<false>)
    : Promise<SchedulerSetup<true>>;
async function setupScheduler(
    limits: RateLimits,
    taskCount: number,
    { autoResolveTasks = true, periodResetSafetyBuffer }: SchedulerSetupOptions<boolean> = {},
): Promise<SchedulerSetup<boolean>> {
    if (limits.second || limits.minute || limits.hour || limits.day || limits.month) {
        // For time based rate limits, wait for a new second or minute to start to run tests with consistent conditions,
        // for example ensuring that there are still a minimum amount of seconds remaining in the current minute, to be
        // able to reach the limit per minute, given the limit per second.
        const minimumRemainingSecondsInMinute = limits.minute && limits.second
            ? Math.ceil(limits.minute / limits.second) + /* extra buffer */ 1
            : 0;
        await waitForNewSecondOrMinute(minimumRemainingSecondsInMinute);
    }

    const scheduler = new RateLimitScheduler(limits, periodResetSafetyBuffer);
    const task = () => new Promise<number>((resolve) => {
        const counter = ++schedulerSetup.taskExecutions;
        if (autoResolveTasks) {
            resolve(counter);
        } else {
            taskResolvers.push(() => resolve(counter));
        }
    });
    const taskResolvers: Array<() => void> = [];
    const schedulerSetup = {
        scheduler,
        task,
        taskExecutions: 0,
        ...(!autoResolveTasks ? { taskResolvers } : null),
    };
    for (let i = 0; i < taskCount; ++i) {
        scheduler.schedule(task);
    }
    return schedulerSetup;
}

async function wait(time: number): Promise<void> {
    await new Promise((resolve) => { setTimeout(resolve, time); });
}

async function waitForNewSecondOrMinute(minimumRemainingSecondsInMinute: number): Promise<void> {
    const now = Date.now();
    const remainingTimeInSecond = ONE_SECOND - (now % ONE_SECOND);
    const remainingTimeInMinute = ONE_MINUTE - (now % ONE_MINUTE);
    if (remainingTimeInMinute < minimumRemainingSecondsInMinute * 1000) {
        // Wait for new minute to start
        await wait(remainingTimeInMinute);
    } else {
        // Wait for new second to start
        await wait(remainingTimeInSecond);
    }
}

describe('RateLimitScheduler', () => {
    it('can schedule tasks and retrieve their results', async () => {
        const setup = await setupScheduler({}, 0); // No limits set and no tasks.
        for (let i = 0; i < 10; ++i) {
            // eslint-disable-next-line no-await-in-loop
            expect(await setup.scheduler.schedule(setup.task)).toBe(setup.taskExecutions);
        }
    });

    it('can rate limit per time period', async () => {
        const limits = {
            second: 10,
            minute: 35,
        };
        const taskCount = 50;
        const setup = await setupScheduler(limits, taskCount);
        for (let i = 1; i <= 3; ++i) {
            expect(setup.taskExecutions).toBe(i * limits.second);
            await wait(1000); // eslint-disable-line no-await-in-loop
        }
        expect(setup.taskExecutions).toBe(limits.minute);
        await wait(1000);
        expect(setup.taskExecutions).toBe(limits.minute); // still rate limited
        await waitForNewSecondOrMinute(60); // enforce waiting for new minute
        await wait(10); // extra time to make sure that the scheduler did also already run
        expect(setup.taskExecutions).toBe(limits.minute + limits.second);
        await wait(1000);
        expect(setup.taskExecutions).toBe(taskCount);
    }, 65000);

    it('can rate limit parallel tasks', async () => {
        const limits = { parallel: 5 };
        const taskCount = 47;
        const setup = await setupScheduler(limits, taskCount, { autoResolveTasks: false });
        let taskCountResolved = 0;
        while (taskCountResolved < taskCount) {
            // Resolve running tasks in batches of varying size.
            const batchSize = Math.min(
                taskCount - taskCountResolved,
                Math.round(Math.random() * limits.parallel),
            );
            for (let i = 0; i < batchSize; ++i) {
                setup.taskResolvers[taskCountResolved++]();
            }
            // Interrupt to let nodejs run other code like updates of our scheduler
            await wait(0); // eslint-disable-line no-await-in-loop
            expect(setup.taskExecutions).toBe(Math.min(taskCount, taskCountResolved + limits.parallel));
        }
    });

    it('can update rate limits', async () => {
        const limits = { second: 10 };
        const limitsIncreased = { second: 20 };
        const limitsReduced = { second: 5 };
        const taskCount = 47;
        const setup = await setupScheduler(limits, taskCount);
        expect(setup.taskExecutions).toBe(limits.second);
        // Increase limits
        setup.scheduler.setRateLimits(limitsIncreased);
        expect(setup.taskExecutions).toBe(limitsIncreased.second); // new tasks could immediately run without waiting
        await wait(1000);
        expect(setup.taskExecutions).toBe(2 * limitsIncreased.second);
        // Decrease limits
        setup.scheduler.setRateLimits(limitsReduced);
        expect(setup.taskExecutions).toBe(2 * limitsIncreased.second); // no new tasks can run without waiting
        await wait(1000);
        expect(setup.taskExecutions).toBe(2 * limitsIncreased.second + limitsReduced.second);
        expect(setup.taskExecutions).not.toBe(taskCount);
        await wait(1000);
        expect(setup.taskExecutions).toBe(taskCount);
    });

    it('can get and overwrite usages', async () => {
        const limits = { minute: 5 };
        const taskCount = 12;
        const setup = await setupScheduler(limits, taskCount);
        const { scheduler } = setup;
        await wait(0); // Wait for tasks to resolve and parallel count to be updated.
        expect(setup.taskExecutions).toBe(limits.minute);
        expect(scheduler.getUsages()).toEqual({ second: 5, minute: 5, hour: 5, day: 5, month: 5, parallel: 0 });

        scheduler.setUsages({ hour: 0 }); // Reset usage per hour, and shorter periods (minute and second)
        await wait(0);
        expect(setup.taskExecutions).toBe(2 * limits.minute); // new tasks could immediately run without waiting
        expect(scheduler.getUsages()).toEqual({ second: 5, minute: 5, hour: 5, day: 10, month: 10, parallel: 0 });

        scheduler.setUsages({ hour: 20 }); // Increase usage per hour, and longer periods (day and month)
        await wait(0);
        expect(setup.taskExecutions).toBe(2 * limits.minute); // no new tasks can run without waiting
        expect(scheduler.getUsages()).toEqual({ second: 5, minute: 5, hour: 20, day: 20, month: 20, parallel: 0 });

        scheduler.setUsages({ minute: 0, day: 50 }); // Decrease minute and second, increase day and month
        await wait(0);
        expect(setup.taskExecutions).toBe(taskCount); // final tasks could immediately run without waiting
        expect(scheduler.getUsages()).toEqual({ second: 2, minute: 2, hour: 22, day: 52, month: 52, parallel: 0 });

        // At this point all tasks have been executed
        scheduler.setUsages({ second: 7 }); // Increase usage per second and longer (all), where it's not already higher
        scheduler.schedule(setup.task);
        expect(setup.taskExecutions).toBe(taskCount); // Newly scheduled tasks can not run without waiting.
        expect(scheduler.getUsages()).toEqual({ second: 7, minute: 7, hour: 22, day: 52, month: 52, parallel: 0 });

        scheduler.setUsages({ month: 0 }); // Reset usage per month and shorter (all)
        await wait(0);
        expect(setup.taskExecutions).toBe(taskCount + 1); // Ran all tasks we scheduled
        expect(scheduler.getUsages()).toEqual({ second: 1, minute: 1, hour: 1, day: 1, month: 1, parallel: 0 });
    });

    it('can conditionally set usages', async () => {
        const scheduler = new RateLimitScheduler({});
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 0, day: 0, month: 0, parallel: 0 });
        scheduler.setUsages({ hour: 5 }); // overwrite
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 5, day: 5, month: 5, parallel: 0 });
        scheduler.setUsages({ day: 3 }, 'increase-only'); // should result in no change
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 5, day: 5, month: 5, parallel: 0 });
        scheduler.setUsages({ day: 7 }, 'increase-only');
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 5, day: 7, month: 7, parallel: 0 });
        scheduler.setUsages({ day: 11 }, 'decrease-only'); // should result in no change
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 5, day: 7, month: 7, parallel: 0 });
        scheduler.setUsages({ day: 3 }, 'decrease-only');
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 0, hour: 3, day: 3, month: 7, parallel: 0 });
        scheduler.setUsages({ minute: 9, day: 0 }); // Overwrite; on inconsistent usages, bias towards higher usages
        expect(scheduler.getUsages()).toEqual({ second: 0, minute: 9, hour: 9, day: 9, month: 9, parallel: 0 });
        scheduler.setUsages({ second: 1, minute: 2, hour: 3, day: 4, month: 5 }, 'increase-only');
        expect(scheduler.getUsages()).toEqual({ second: 1, minute: 9, hour: 9, day: 9, month: 9, parallel: 0 });
        scheduler.setUsages({ second: 2, minute: 3, hour: 4, day: 5, month: 6 }, 'decrease-only');
        expect(scheduler.getUsages()).toEqual({ second: 1, minute: 3, hour: 4, day: 5, month: 6, parallel: 0 });
    });

    it('can pause tasks', async () => {
        const limits = { second: 5 };
        const taskCount = 10;
        const setup = await setupScheduler(limits, taskCount);
        expect(setup.taskExecutions).toBe(limits.second);
        setup.scheduler.pause(1100);
        setup.scheduler.pause(1300); // A longer pause should overwrite a previous pause.
        setup.scheduler.pause(1200); // A shorter pause should not overwrite a previous pause.
        await wait(1000);
        expect(setup.taskExecutions).toBe(limits.second); // Due to pause no new tasks should run, even on period reset.
        await wait(200); // Wait until the shorter pause ends.
        expect(setup.taskExecutions).toBe(limits.second); // The shorter pause should not have overwritten longer pause.
        await wait(100); // Wait until the longer pause ends.
        expect(setup.taskExecutions).toBe(2 * limits.second); // After the pause actually ends, new tasks run.
    });

    it('supports period reset time safety buffers', async () => {
        const limits = { second: 20 };
        const periodResetSafetyBuffer = 100;
        const setup = await setupScheduler(limits, 0, { periodResetSafetyBuffer });
        const { scheduler } = setup;
        scheduler.schedule(setup.task);
        await wait(periodResetSafetyBuffer / 2);
        expect(setup.taskExecutions).toBe(0); // Within the safety buffer after period reset time, no tasks should run
        await wait(periodResetSafetyBuffer / 2); // Wait until end of safety buffer after period reset
        expect(setup.taskExecutions).toBe(1); // Once the safety buffer is over, tasks can run
        await wait(ONE_SECOND - 2 * periodResetSafetyBuffer); // Wait until start of safety buffer before period reset
        scheduler.schedule(setup.task);
        expect(setup.taskExecutions).toBe(1); // Within the safety buffer before period reset time, no tasks should run
        await wait(periodResetSafetyBuffer); // Wait until original period reset time, within safety buffer
        expect(setup.taskExecutions).toBe(1); // Within the safety buffer after period reset time, no tasks should run
        await wait(periodResetSafetyBuffer); // Wait until end of safety buffer after period reset
        expect(setup.taskExecutions).toBe(2); // Once the safety buffer is over, tasks can run
    });

    it('should check rate limits against safety buffers to leave enough time to actually run tasks', () => {
        const expectedError = 'Period reset safety buffer too long for second rate limit.';
        expect(() => new RateLimitScheduler({ second: 20 }, ONE_SECOND)).toThrow(expectedError);
        expect(() => new RateLimitScheduler({ second: 20 }, ONE_SECOND / 2 - 100)).not.toThrow();
        const scheduler = new RateLimitScheduler({}, ONE_SECOND);
        expect(() => scheduler.setRateLimits({ second: 20 })).toThrow(expectedError);
    });
});
