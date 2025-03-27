import {
    BLOCKS_DELAY_DECAY,
    BLOCKS_PER_BATCH,
    BLOCKS_PER_EPOCH,
    JAIL_EPOCHS,
    MINIMUM_REWARDS_PERCENTAGE,
    PROOF_OF_STAKE_MIGRATION_BLOCK,
    PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET,
} from './constants';

interface BaseOptions {
    /**
     * Whether to use the testnet block height for proof-of-stake migration.
     * @default false
     */
    testnet?: boolean;
}

const getMigrationBlock = (testnet = false) => (testnet
    ? PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET
    : PROOF_OF_STAKE_MIGRATION_BLOCK);

/**
 * Returns the epoch number for a given block number.
 */
export function epochAt(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber <= migrationBlock) return 0;
    const offset = blockNumber - migrationBlock;
    return Math.floor((offset + BLOCKS_PER_EPOCH - 1) / BLOCKS_PER_EPOCH);
}

/**
 * Returns the epoch index for a given block number.
 * Adjusted to add BLOCKS_PER_EPOCH - 1 before taking the modulo.
 */
export function epochIndexAt(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return blockNumber;
    return (blockNumber - migrationBlock + BLOCKS_PER_EPOCH - 1) % BLOCKS_PER_EPOCH;
}

/**
 * Returns the batch number for a given block number.
 */
export function batchAt(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber <= migrationBlock) return 0;
    const offset = blockNumber - migrationBlock;
    return Math.floor((offset + BLOCKS_PER_BATCH - 1) / BLOCKS_PER_BATCH);
}

/**
 * Returns the batch index for a given block number.
 * Adjusted to add BLOCKS_PER_BATCH - 1 before taking the modulo.
 */
export function batchIndexAt(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return blockNumber;
    return (blockNumber - migrationBlock + BLOCKS_PER_BATCH - 1) % BLOCKS_PER_BATCH;
}

/**
 * Checks if a given block number is a macro block.
 */
export function isMacroBlockAt(blockNumber: number, options: BaseOptions = {}): boolean {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return false;
    return batchIndexAt(blockNumber, options) === BLOCKS_PER_BATCH - 1;
}

/**
 * Checks if a given block number is an election block.
 */
export function isElectionBlockAt(blockNumber: number, options: BaseOptions = {}): boolean {
    return epochIndexAt(blockNumber, options) === BLOCKS_PER_EPOCH - 1;
}

/**
 * Checks if a given block number is a micro block.
 */
export function isMicroBlockAt(blockNumber: number, options: BaseOptions = {}): boolean {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return false;
    return !isMacroBlockAt(blockNumber, options);
}

/**
 * Returns the next macro block number after the given block number.
 */
export function macroBlockAfter(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return migrationBlock;
    const offset = blockNumber - migrationBlock;
    return ((Math.floor(offset / BLOCKS_PER_BATCH) + 1) * BLOCKS_PER_BATCH) + migrationBlock;
}

/**
 * Returns the last macro block number before the given block number.
 */
export function lastMacroBlock(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) throw new Error('No macro blocks before proof-of-stake migration');
    const offset = blockNumber - migrationBlock;
    return Math.floor(offset / BLOCKS_PER_BATCH) * BLOCKS_PER_BATCH + migrationBlock;
}

/**
 * Returns the next election block number after the given block number.
 */
export function electionBlockAfter(blockNumber: number, options: BaseOptions = {}): number {
    const migrationBlock = getMigrationBlock(options.testnet);
    if (blockNumber < migrationBlock) return migrationBlock;
    const offset = blockNumber - migrationBlock;
    return ((Math.floor(offset / BLOCKS_PER_EPOCH) + 1) * BLOCKS_PER_EPOCH) + migrationBlock;
}

/**
 * Returns the first block number of the given epoch.
 */
export function firstBlockOf(epoch: number, options: BaseOptions = {}): number | undefined {
    if (epoch <= 0) return undefined;
    const migrationBlock = getMigrationBlock(options.testnet);
    return (epoch - 1) * BLOCKS_PER_EPOCH + migrationBlock + 1;
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
export function electionBlockOf(epoch: number, options: BaseOptions = {}): number | undefined {
    if (epoch < 0) return undefined;
    const migrationBlock = getMigrationBlock(options.testnet);
    return migrationBlock + (epoch + 1) * BLOCKS_PER_EPOCH - 1;
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
export function firstBatchOfEpoch(blockNumber: number, options: BaseOptions = {}): boolean {
    return epochIndexAt(blockNumber, options) < BLOCKS_PER_BATCH;
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
