import {
    POS_DECAY_PER_DAY,
    PROOF_OF_STAKE_MIGRATION_DATE,
    SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE,
    SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE_TESTNET,
} from '../albatross-policy/albatross-policy';
import { posSupplyAt } from '../supply-calculator/supply-calculator';

export interface CalculateStakingRewardsParams {
    /**
     * The ratio of the total staked cryptocurrency to the total supply.
     */
    stakedSupplyRatio: number

    /**
     * The initial amount of cryptocurrency staked, in NIM.
     * @default 1
     */
    amount?: number

    /**
     * The number of days the cryptocurrency is staked.
     * @default 365
     */
    days?: number

    /**
     * Indicates whether the staking rewards are restaked (default is true). Restaked mean that each staking
     * reward is added to the pool of staked cryptocurrency for compound interest.
     * @default true
     */
    autoRestake?: boolean

    /**
     * The network name
     *
     * @default 'main-albatross'
     */
    network?: 'main-albatross' | 'test-albatross'

    /**
     * The fee percentage that the pool charges for staking.
     * @default 0
     */
    fee?: number
}

export interface CalculateStakingRewardsResult {
    /**
     * The total amount of cryptocurrency after staking for the specified number of days, in NIM.
     * Considering the decay of rewards and whether the rewards are restaked.
     */
    totalAmount: number

    /**
     * The gain in cryptocurrency after staking for the specified number of days,
     * considering the decay of rewards and whether the rewards are restaked, in NIM.
     */
    gain: number

    /**
     * The gain in percentage after staking for the specified number of days,
     * considering the decay of rewards and whether the rewards are restaked.
     */
    gainRatio: number
}

/**
 * Calculates the potential wealth accumulation based on staking in a cryptocurrency network,
 * considering the effects of reward decay over time. It computes the final amount of cryptocurrency
 * after a specified number of days of staking, taking into account whether the rewards are restaked or not.
 * @param {CalculateStakingRewardsParams} params The parameters for the calculation. @see CalculateStakingRewardsParams
 * @returns {CalculateStakingRewardsResult} The result of the calculation.
 */
export function calculateStakingRewards(params: CalculateStakingRewardsParams): CalculateStakingRewardsResult {
    const {
        amount = 1e5,
        days = 365,
        autoRestake = true,
        stakedSupplyRatio,
        network = 'main-albatross',
        fee = 0,
    } = params;

    // Validate parameters
    if (stakedSupplyRatio < 0 || stakedSupplyRatio > 1) {
        throw new Error(`Invalid stakedSupplyRatio: ${stakedSupplyRatio}. It must be in the range [0, 1].`);
    }
    if (fee < 0 || fee > 1) {
        throw new Error(`Invalid fee: ${fee}. It must be between 0 and 1.`);
    }

    const genesisSupply = network === 'test-albatross'
        ? SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE_TESTNET
        : SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE;

    const oneDayAfterGenesis = PROOF_OF_STAKE_MIGRATION_DATE.getTime() + 24 * 60 * 60 * 1000;
    const initialRewardsPerDay = posSupplyAt(oneDayAfterGenesis, { network }) - genesisSupply;
    const decayFactor = Math.E ** (-POS_DECAY_PER_DAY * days);

    let gainRatio = 0;
    if (autoRestake) {
        const rewardFactor = initialRewardsPerDay / (POS_DECAY_PER_DAY * stakedSupplyRatio * genesisSupply);
        gainRatio = rewardFactor * (1 - decayFactor);
    } else {
        gainRatio = (1 / stakedSupplyRatio) * (
            Math.log(
                (POS_DECAY_PER_DAY * genesisSupply * (1 / decayFactor))
                + initialRewardsPerDay * (1 / decayFactor) - initialRewardsPerDay,
            )
            - POS_DECAY_PER_DAY * days
            - Math.log(POS_DECAY_PER_DAY * genesisSupply)
        );
    }
    gainRatio *= (1 - fee);
    const totalAmount = amount * (1 + gainRatio);
    return { totalAmount, gain: totalAmount - amount, gainRatio };
}
