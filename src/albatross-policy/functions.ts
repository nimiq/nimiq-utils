import {
    BLOCKS_DELAY_DECAY,
    BLOCKS_PER_BATCH,
    BLOCKS_PER_EPOCH,
    JAIL_EPOCHS,
    MINIMUM_REWARDS_PERCENTAGE,
    PROOF_OF_STAKE_MIGRATION_BLOCK,
    PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET,
    PROOF_OF_STAKE_MIGRATION_DATE,
    PROOF_OF_STAKE_MIGRATION_DATE_TESTNET,
} from './constants';

function getNetwork(network?: string) {
    if (!network) return { isMainnet: true, isTestnet: false }; // default to mainnet
    if (network?.toLowerCase().includes('test')) return { isMainnet: false, isTestnet: true };
    if (network?.toLowerCase().includes('main')) return { isMainnet: true, isTestnet: false };
    console.warn(`Network "${network}" not implemented.`);
    return { isMainnet: false, isTestnet: false };
}

export interface BaseAlbatrossPolicyOptions {
    /**
     * Whether to use the testnet block height for proof-of-stake migration.
     * Can be a boolean or a string containing 'test' to use testnet values.
     * @default 'main-albatross'
     */
    network?: string;
    /**
     * Custom migration block to use instead of the default.
     */
    migrationBlock?: number;
}

/* eslint-disable max-len */
/**
 * Gets the appropriate migration block based on options.
 * If a custom migrationBlock is provided in options, that takes precedence.
 * Otherwise, it checks if the network is testnet and returns the corresponding migration block.
 *
 * Check https://github.com/nimiq/core-rs-albatross/blob/7b6cb0f5f90afff74ccaa14fe33dec3622ce228e/primitives/src/networks.rs#L74-L85 to see the network names.
 */
export function getMigrationBlock(options: BaseAlbatrossPolicyOptions = { network: 'main-albatross' }): number {
    if (options.migrationBlock !== undefined) return options.migrationBlock;
    const { isMainnet, isTestnet } = getNetwork(options.network);
    if (isTestnet) return PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET;
    if (isMainnet) return PROOF_OF_STAKE_MIGRATION_BLOCK;
    throw new Error(`Network "${options.network}" not implemented.`);
}
/* eslint-disable-next-line max-len */

/**
 * Returns information about the migration block based on the network.
 */
export function getMigrationBlockInfo({ network }: Pick<BaseAlbatrossPolicyOptions, 'network'> = {}) {
    const migrationBlock = getMigrationBlock({ network });
    const { isTestnet, isMainnet } = getNetwork(network);
    if (!isTestnet && !isMainnet) {
        throw new Error(`Network "${network}" not implemented.`);
    }
    const date = isTestnet ? PROOF_OF_STAKE_MIGRATION_DATE_TESTNET : PROOF_OF_STAKE_MIGRATION_DATE;
    const timestamp = date.getTime();
    return { timestamp, date, migrationBlock };
}

/**
 * Returns the epoch number for a given block number.
 */
export function epochAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber <= migrationBlock) return 0;
    const offset = blockNumber - migrationBlock;
    return Math.floor((offset + BLOCKS_PER_EPOCH - 1) / BLOCKS_PER_EPOCH);
}

/**
 * Returns the epoch index for a given block number.
 * Adjusted to add BLOCKS_PER_EPOCH - 1 before taking the modulo.
 */
export function epochIndexAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return blockNumber;
    return (blockNumber - migrationBlock + BLOCKS_PER_EPOCH - 1) % BLOCKS_PER_EPOCH;
}

/**
 * Returns the batch number for a given block number.
 */
export function batchAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber <= migrationBlock) return 0;
    const offset = blockNumber - migrationBlock;
    return Math.floor((offset + BLOCKS_PER_BATCH - 1) / BLOCKS_PER_BATCH);
}

/**
 * Returns the batch index for a given block number.
 * Adjusted to add BLOCKS_PER_BATCH - 1 before taking the modulo.
 */
export function batchIndexAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return blockNumber;
    return (blockNumber - migrationBlock + BLOCKS_PER_BATCH - 1) % BLOCKS_PER_BATCH;
}

/**
 * Checks if a given block number is a macro block.
 */
export function isMacroBlockAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): boolean {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return false;
    return batchIndexAt(blockNumber, options) === BLOCKS_PER_BATCH - 1;
}

/**
 * Checks if a given block number is an election block.
 */
export function isElectionBlockAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): boolean {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return false;
    return epochIndexAt(blockNumber, options) === BLOCKS_PER_EPOCH - 1;
}

/**
 * Checks if a given block number is a micro block.
 */
export function isMicroBlockAt(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): boolean {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return false;
    return !isMacroBlockAt(blockNumber, options);
}

/**
 * Returns the next macro block number after the given block number.
 */
export function macroBlockAfter(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number | undefined {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return migrationBlock;

    const offset = blockNumber - migrationBlock;
    const batchCount = Math.floor(offset / BLOCKS_PER_BATCH) + 1;

    // Check for safe integer multiplication
    const mulResult = batchCount * BLOCKS_PER_BATCH;
    if (!Number.isSafeInteger(mulResult)) return undefined;

    // Check for safe integer addition
    const addResult = mulResult + migrationBlock;
    if (!Number.isSafeInteger(addResult)) return undefined;

    return addResult;
}

/**
 * Returns the last macro block number before the given block number.
 */
export function lastMacroBlock(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number | undefined {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) throw new Error('No macro blocks before proof-of-stake migration');

    const offset = blockNumber - migrationBlock;
    const batchCount = Math.floor(offset / BLOCKS_PER_BATCH);

    // Check for safe integer multiplication
    const mulResult = batchCount * BLOCKS_PER_BATCH;
    if (!Number.isSafeInteger(mulResult)) return undefined;

    // Check for safe integer addition
    const addResult = mulResult + migrationBlock;
    if (!Number.isSafeInteger(addResult)) return undefined;

    return addResult;
}

/**
 * Returns the next election block number after the given block number.
 */
export function electionBlockAfter(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): number | undefined {
    const migrationBlock = getMigrationBlock(options);
    if (blockNumber < migrationBlock) return migrationBlock;

    const offset = blockNumber - migrationBlock;
    const epochCount = Math.floor(offset / BLOCKS_PER_EPOCH) + 1;

    // Check for safe integer multiplication
    const mulResult = epochCount * BLOCKS_PER_EPOCH;
    if (!Number.isSafeInteger(mulResult)) return undefined;

    // Check for safe integer addition
    const addResult = mulResult + migrationBlock;
    if (!Number.isSafeInteger(addResult)) return undefined;

    return addResult;
}

/**
 * Returns the first block number of the given epoch.
 */
export function firstBlockOf(epoch: number, options: BaseAlbatrossPolicyOptions = {}): number | undefined {
    if (epoch <= 0) return undefined;

    const migrationBlock = getMigrationBlock(options);

    // Check for safe integer subtraction
    const subResult = epoch - 1;
    if (!Number.isSafeInteger(subResult)) return undefined;

    // Check for safe integer multiplication
    const mulResult = subResult * BLOCKS_PER_EPOCH;
    if (!Number.isSafeInteger(mulResult)) return undefined;

    // Check for safe integer addition
    const addResult = mulResult + migrationBlock + 1;
    if (!Number.isSafeInteger(addResult)) return undefined;

    return addResult;
}

/**
 * Returns the block number after the jail period.
 */
export function blockAfterJail(blockNumber: number): number | undefined {
    const mulResult = BLOCKS_PER_EPOCH * JAIL_EPOCHS;
    if (!Number.isSafeInteger(mulResult)) return undefined;
    const addResult = blockNumber + mulResult + 1;
    if (!Number.isSafeInteger(addResult)) return undefined;
    return addResult;
}

/**
 * Returns the election block number for a given epoch.
 */
export function electionBlockOf(epoch: number, options: BaseAlbatrossPolicyOptions = {}): number | undefined {
    if (epoch < 0) return undefined;
    const genesisBlock = getMigrationBlock(options);
    const mulResult = epoch * BLOCKS_PER_EPOCH;
    if (!Number.isSafeInteger(mulResult)) return undefined;
    const addResult = mulResult + genesisBlock;
    if (!Number.isSafeInteger(addResult)) return undefined;
    return addResult;
}

/**
 * Calculates rewards penalty due to batch delay.
 */
export function batchDelayPenalty(delayMs: number): number {
    if (!Number.isSafeInteger(delayMs) || delayMs < 0) {
        return MINIMUM_REWARDS_PERCENTAGE;
    }

    // Calculate (BLOCKS_DELAY_DECAY ** delayMs)
    const decayPower = BLOCKS_DELAY_DECAY ** delayMs;
    // Calculate final decay = decayPower ** delayMs
    const finalDecay = decayPower ** delayMs;

    return (1 - MINIMUM_REWARDS_PERCENTAGE) * finalDecay + MINIMUM_REWARDS_PERCENTAGE;
}

/**
 * Returns true if the block number is the first batch of an epoch.
 */
export function firstBatchOfEpoch(blockNumber: number, options: BaseAlbatrossPolicyOptions = {}): boolean {
    return epochIndexAt(blockNumber, options) < BLOCKS_PER_BATCH;
}

/**
 * Returns the last block number of the reporting window for a given block number.
 */
export function lastBlockOfReportingWindow(blockNumber: number): number | undefined {
    const addResult = blockNumber + BLOCKS_PER_EPOCH;
    if (!Number.isSafeInteger(addResult)) return undefined;
    return addResult;
}

/**
 * Returns the block number immediately after the reporting window for a given block number.
 */
export function blockAfterReportingWindow(blockNumber: number): number | undefined {
    const lastBlock = lastBlockOfReportingWindow(blockNumber);
    if (lastBlock === undefined) return undefined;

    const addResult = lastBlock + 1;
    if (!Number.isSafeInteger(addResult)) return undefined;

    return addResult;
}
