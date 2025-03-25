import {
    BLOCKS_DELAY_DECAY,
    BLOCKS_PER_BATCH,
    BLOCKS_PER_EPOCH,
    JAIL_EPOCHS,
    MINIMUM_REWARDS_PERCENTAGE,
    PROOF_OF_STAKE_MIGRATION_BLOCK,
} from './constants';

/**
 * Returns the epoch number for a given block number.
 */
export function epochAt(blockNumber: number): number {
    if (blockNumber <= PROOF_OF_STAKE_MIGRATION_BLOCK) return 0;
    const offset = blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK;
    return Math.floor((offset + BLOCKS_PER_EPOCH - 1) / BLOCKS_PER_EPOCH);
}

/**
 * Returns the epoch index for a given block number.
 */
export function epochIndexAt(blockNumber: number): number {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return blockNumber;
    return (blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK) % BLOCKS_PER_EPOCH;
}

/**
 * Returns the batch number for a given block number.
 */
export function batchAt(blockNumber: number): number {
    if (blockNumber <= PROOF_OF_STAKE_MIGRATION_BLOCK) return 0;
    const offset = blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK;
    return Math.floor((offset + BLOCKS_PER_BATCH - 1) / BLOCKS_PER_BATCH);
}

/**
 * Returns the batch index for a given block number.
 */
export function batchIndexAt(blockNumber: number): number {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return blockNumber;
    return (blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK) % BLOCKS_PER_BATCH;
}

/**
 * Checks if a given block number is a macro block.
 */
export function isMacroBlockAt(blockNumber: number): boolean {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return false;
    return batchIndexAt(blockNumber) === BLOCKS_PER_BATCH - 1;
}

/**
 * Checks if a given block number is an election block.
 */
export function isElectionBlockAt(blockNumber: number): boolean {
    return epochIndexAt(blockNumber) === BLOCKS_PER_EPOCH - 1;
}

/**
 * Checks if a given block number is a micro block.
 */
export function isMicroBlockAt(blockNumber: number): boolean {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return false;
    return !isMacroBlockAt(blockNumber);
}

/**
 * Returns the next macro block number after the given block number.
 */
export function macroBlockAfter(blockNumber: number): number {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return PROOF_OF_STAKE_MIGRATION_BLOCK;
    const offset = blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK;
    return ((Math.floor(offset / BLOCKS_PER_BATCH) + 1) * BLOCKS_PER_BATCH) + PROOF_OF_STAKE_MIGRATION_BLOCK;
}

/**
 * Returns the last macro block number before the given block number.
 */
export function lastMacroBlock(blockNumber: number): number {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) throw new Error('No macro blocks before genesis');
    const offset = blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK;
    return Math.floor(offset / BLOCKS_PER_BATCH) * BLOCKS_PER_BATCH + PROOF_OF_STAKE_MIGRATION_BLOCK;
}

/**
 * Returns the next election block number after the given block number.
 */
export function electionBlockAfter(blockNumber: number): number {
    if (blockNumber < PROOF_OF_STAKE_MIGRATION_BLOCK) return PROOF_OF_STAKE_MIGRATION_BLOCK;
    const offset = blockNumber - PROOF_OF_STAKE_MIGRATION_BLOCK;
    return ((Math.floor(offset / BLOCKS_PER_EPOCH) + 1) * BLOCKS_PER_EPOCH) + PROOF_OF_STAKE_MIGRATION_BLOCK;
}

/**
 * Returns the first block number of the given epoch.
 */
export function firstBlockOf(epoch: number): number | undefined {
    if (epoch <= 0) return undefined;
    return (epoch - 1) * BLOCKS_PER_EPOCH + PROOF_OF_STAKE_MIGRATION_BLOCK + 1;
}

/**
 * Returns the block number after the jail period.
 */
export function blockAfterJail(blockNumber: number): number {
    return blockNumber + BLOCKS_PER_EPOCH * JAIL_EPOCHS + 1;
}

/**
 * Returns the election block number for a given epoch.
 */
export function electionBlockOf(epoch: number): number | undefined {
    if (epoch < 0) return undefined;
    return PROOF_OF_STAKE_MIGRATION_BLOCK + (epoch + 1) * BLOCKS_PER_EPOCH - 1;
}

/**
 * Calculates rewards penalty due to batch delay.
 */
export function batchDelayPenalty(delayMs: number): number {
    return (1 - MINIMUM_REWARDS_PERCENTAGE)
        * (BLOCKS_DELAY_DECAY ** delayMs) ** delayMs
        + MINIMUM_REWARDS_PERCENTAGE;
}

/**
 * Returns true if the block number is the first batch of an epoch.
 */
export function firstBatchOfEpoch(blockNumber: number): boolean {
    return epochIndexAt(blockNumber) < BLOCKS_PER_BATCH;
}

/**
 * Returns the last block number of the reporting window for a given block number.
 */
export function lastBlockOfReportingWindow(blockNumber: number): number {
    return blockNumber + BLOCKS_PER_EPOCH;
}

/**
 * Returns the block number immediately after the reporting window for a given block number.
 */
export function blockAfterReportingWindow(blockNumber: number): number {
    return lastBlockOfReportingWindow(blockNumber) + 1;
}
