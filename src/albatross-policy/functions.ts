/**
 * Function to get the epoch number at a given block number.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerEpoch - The number of blocks per epoch.
 * @returns The epoch number for the given block number.
 */
export function epochAt(blockNumber: number, genesisBlockNumber: number, blocksPerEpoch: number): number {
    if (blockNumber <= genesisBlockNumber) {
        return 0;
    }

    const blockNumberOffset = blockNumber - genesisBlockNumber;
    return Math.floor((blockNumberOffset + blocksPerEpoch - 1) / blocksPerEpoch);
}

/**
 * Function to get the epoch index at a given block number.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerEpoch - The number of blocks per epoch.
 * @returns The epoch index for the given block number.
 */
export function epochIndexAt(blockNumber: number, genesisBlockNumber: number, blocksPerEpoch: number): number {
    if (blockNumber < genesisBlockNumber) {
        return blockNumber;
    }

    const blockNumberOffset = blockNumber - genesisBlockNumber;
    return (blockNumberOffset) % blocksPerEpoch;
}

/**
 * Function to get the batch number at a given block number.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerBatch - The number of blocks per batch.
 * @returns The batch number for the given block number.
 */
export function batchAt(blockNumber: number, genesisBlockNumber: number, blocksPerBatch: number): number {
    if (blockNumber <= genesisBlockNumber) {
        return 0;
    }

    const blockNumberOffset = blockNumber - genesisBlockNumber;
    return Math.floor((blockNumberOffset + blocksPerBatch - 1) / blocksPerBatch);
}

/**
 * Function to get the batch index at a given block number.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerBatch - The number of blocks per batch.
 * @returns The batch index for the given block number.
 */
export function batchIndexAt(blockNumber: number, genesisBlockNumber: number, blocksPerBatch: number): number {
    if (blockNumber < genesisBlockNumber) {
        return blockNumber;
    }

    const blockNumberOffset = blockNumber - genesisBlockNumber;
    return (blockNumberOffset) % blocksPerBatch;
}

/**
 * Function to determine if a block is a macro block.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerBatch - The number of blocks per batch.
 * @returns True if the block is a macro block, otherwise false.
 */
export function isMacroBlockAt(blockNumber: number, genesisBlockNumber: number, blocksPerBatch: number): boolean {
    if (blockNumber < genesisBlockNumber) {
        return false;
    }

    return batchIndexAt(blockNumber, genesisBlockNumber, blocksPerBatch) === blocksPerBatch - 1;
}

/**
 * Function to determine if a block is an election block.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerEpoch - The number of blocks per epoch.
 * @returns True if the block is an election block, otherwise false.
 */
export function isElectionBlockAt(blockNumber: number, genesisBlockNumber: number, blocksPerEpoch: number): boolean {
    return epochIndexAt(blockNumber, genesisBlockNumber, blocksPerEpoch) === blocksPerEpoch - 1;
}

/**
 * Function to determine if a block is a micro block.
 * @param blockNumber - The block number to check.
 * @param genesisBlockNumber - The genesis block number.
 * @param blocksPerBatch - The number of blocks per batch.
 * @returns True if the block is a micro block, otherwise false.
 */
export function isMicroBlockAt(blockNumber: number, genesisBlockNumber: number, blocksPerBatch: number): boolean {
    if (blockNumber < genesisBlockNumber) {
        return false;
    }

    return batchIndexAt(blockNumber, genesisBlockNumber, blocksPerBatch) !== blocksPerBatch - 1;
}
