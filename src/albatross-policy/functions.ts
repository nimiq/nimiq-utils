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
    SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE,
    SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE_TESTNET,
} from './constants';

/**
 * Determine network flags.
 * @param network - Optional network name or identifier.
 * @returns Flags for mainnet/testnet.
 */
function getNetwork(network?: string) {
    if (!network) return { isMainnet: true, isTestnet: false };
    const nl = network.toLowerCase();
    if (nl.includes('test')) return { isMainnet: false, isTestnet: true };
    if (nl.includes('main')) return { isMainnet: true, isTestnet: false };
    console.warn(`Network "${network}" not implemented.`); // eslint-disable-line no-console
    return { isMainnet: false, isTestnet: false };
}

export interface BaseAlbatrossPolicyOptions {
    /* eslint-disable max-len */
    /**
     * Network name for selecting PoS migration values. Different networks have different migration blocks and therefore
     * different epoch and batch calculations.
     * Check https://github.com/nimiq/core-rs-albatross/blob/7b6cb0f5f90afff74ccaa14fe33dec3622ce228e/primitives/src/networks.rs#L74-L85 to see the network names.
     * @default 'main-albatross'
     */
    network?: string;
    /* eslint-enable max-len */

    /**
     * Override the default migration block.
     */
    migrationBlock?: number;
}

/**
 * Get the PoS migration block height.
 * @param options - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function getMigrationBlock(options: BaseAlbatrossPolicyOptions = {}) {
    const { network = 'main-albatross', migrationBlock } = options;
    if (migrationBlock !== undefined) return migrationBlock;
    const { isTestnet, isMainnet } = getNetwork(network);
    if (isTestnet) return PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET;
    if (isMainnet) return PROOF_OF_STAKE_MIGRATION_BLOCK;
    throw new Error(`Network "${network}" not implemented.`);
}

/**
 * Get migration block info for a network.
 * @param opts - Contains optional network. {@link BaseAlbatrossPolicyOptions}
 */
export function getMigrationBlockInfo(options: BaseAlbatrossPolicyOptions = {}) {
    const { network } = options;
    const { isTestnet, isMainnet } = getNetwork(network);
    if (!isTestnet && !isMainnet) {
        throw new Error(`Network "${network}" not implemented.`);
    }
    const migrationBlock = getMigrationBlock(options);
    const date = isTestnet
        ? PROOF_OF_STAKE_MIGRATION_DATE_TESTNET
        : PROOF_OF_STAKE_MIGRATION_DATE;
    const genesisSupply = isTestnet
        ? SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE_TESTNET
        : SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE;
    return { migrationBlock, date, timestamp: date.getTime(), genesisSupply, isTestnet, isMainnet };
}

/**
 * Compute epoch number at a block.
 * @param blockNumber - Block height.
 * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function epochAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber <= genesis) return 0;
    return Math.floor((blockNumber - genesis + BLOCKS_PER_EPOCH - 1) / BLOCKS_PER_EPOCH);
}

/**
 * Compute epoch index within its epoch.
 * @param blockNumber - Block height.
 * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function epochIndexAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber < genesis) return blockNumber;
    return (blockNumber - genesis + BLOCKS_PER_EPOCH - 1) % BLOCKS_PER_EPOCH;
}

/**
 * Compute batch number at a block.
 * @param blockNumber - Block height.
 * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function batchAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber <= genesis) return 0;
    return Math.floor((blockNumber - genesis + BLOCKS_PER_BATCH - 1) / BLOCKS_PER_BATCH);
}

/**
 * Compute batch index within its batch.
 * @param blockNumber - Block height.
 * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function batchIndexAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber < genesis) return blockNumber;
    return (blockNumber - genesis + BLOCKS_PER_BATCH - 1) % BLOCKS_PER_BATCH;
}

/**
 * Check if a block is a macro block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function isMacroBlockAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    return blockNumber >= getMigrationBlock(opts)
        && batchIndexAt(blockNumber, opts) === BLOCKS_PER_BATCH - 1;
}

/**
 * Check if a block is an election block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function isElectionBlockAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    return blockNumber >= getMigrationBlock(opts)
        && epochIndexAt(blockNumber, opts) === BLOCKS_PER_EPOCH - 1;
}

/**
 * Check if a block is a micro block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function isMicroBlockAt(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    return blockNumber >= getMigrationBlock(opts) && !isMacroBlockAt(blockNumber, opts);
}

/**
 * Get next macro block after a block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function macroBlockAfter(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber < genesis) return genesis;
    const next = (Math.floor((blockNumber - genesis) / BLOCKS_PER_BATCH) + 1)
        * BLOCKS_PER_BATCH + genesis;
    return Number.isSafeInteger(next) ? next : undefined;
}

/**
 * Get last macro block before a block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function lastMacroBlock(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber < genesis) throw new Error('No macro blocks before PoS migration');
    const prev = Math.floor((blockNumber - genesis) / BLOCKS_PER_BATCH)
        * BLOCKS_PER_BATCH + genesis;
    return Number.isSafeInteger(prev) ? prev : undefined;
}

/**
 * Get next election block after a block.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function electionBlockAfter(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    const genesis = getMigrationBlock(opts);
    if (blockNumber < genesis) return genesis;
    const next = (Math.floor((blockNumber - genesis) / BLOCKS_PER_EPOCH) + 1)
        * BLOCKS_PER_EPOCH + genesis;
    return Number.isSafeInteger(next) ? next : undefined;
}

/**
 * Get first block of an epoch.
 * @param epoch - Epoch number (1-based).
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function firstBlockOf(epoch: number, opts: BaseAlbatrossPolicyOptions = {}) {
    if (epoch <= 0) return undefined;
    const genesis = getMigrationBlock(opts);
    const block = (epoch - 1) * BLOCKS_PER_EPOCH + genesis + 1;
    return Number.isSafeInteger(block) ? block : undefined;
}

/**
 * Get block after jail period.
 * @param blockNumber - Starting block height.
 */
export function blockAfterJail(blockNumber: number) {
    const result = blockNumber + BLOCKS_PER_EPOCH * JAIL_EPOCHS + 1;
    return Number.isSafeInteger(result) ? result : undefined;
}

/**
 * Get election block for an epoch.
 * @param epoch - Epoch number.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function electionBlockOf(epoch: number, opts: BaseAlbatrossPolicyOptions = {}) {
    if (epoch < 0) return undefined;
    const genesis = getMigrationBlock(opts);
    const block = epoch * BLOCKS_PER_EPOCH + genesis;
    return Number.isSafeInteger(block) ? block : undefined;
}

/**
 * Calculate reward penalty from batch delay.
 * @param delayMs - Delay in ms.
 */
export function batchDelayPenalty(delayMs: number) {
    if (!Number.isSafeInteger(delayMs) || delayMs < 0) {
        return MINIMUM_REWARDS_PERCENTAGE;
    }
    const decay = BLOCKS_DELAY_DECAY ** delayMs;
    const finalDecay = decay ** delayMs;
    return finalDecay * (1 - MINIMUM_REWARDS_PERCENTAGE) + MINIMUM_REWARDS_PERCENTAGE;
}

/**
 * Check if block starts the first batch of an epoch.
 * @param blockNumber - Block height.
  * @param opts - Policy options. {@link BaseAlbatrossPolicyOptions}
 */
export function firstBatchOfEpoch(blockNumber: number, opts: BaseAlbatrossPolicyOptions = {}) {
    return epochIndexAt(blockNumber, opts) < BLOCKS_PER_BATCH;
}

/**
 * Get last block of reporting window.
 * @param blockNumber - Block height.
 */
export function lastBlockOfReportingWindow(blockNumber: number) {
    const last = blockNumber + BLOCKS_PER_EPOCH;
    return Number.isSafeInteger(last) ? last : undefined;
}

/**
 * Get block immediately after the reporting window.
 * @param blockNumber - Block height.
 */
export function blockAfterReportingWindow(blockNumber: number) {
    const last = lastBlockOfReportingWindow(blockNumber);
    if (last === undefined) return undefined;
    const next = last + 1;
    return Number.isSafeInteger(next) ? next : undefined;
}
