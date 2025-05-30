/**
 * The total supply of the cryptocurrency, in LUNA.
 */
export const TOTAL_SUPPLY = 21e14;

/**
 * The date of the proof-of-stake migration.
 */
export const PROOF_OF_STAKE_MIGRATION_DATE = new Date('2024-11-19T16:45:20.000Z');

/**
 * The date of the proof-of-stake migration in **Testnet**.
 */
export const PROOF_OF_STAKE_MIGRATION_DATE_TESTNET = new Date('2024-11-13T20:00:00.000Z');

/**
 * The total supply of the cryptocurrency at the proof-of-stake migration date, in NIM.
 *
 * Same as:
 * powSupplyAfter(powBlockHeightAt(PROOF_OF_STAKE_MIGRATION_DATE))
 */
export const SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE = 12_893_109_654.06244;

/**
 * The total supply of the cryptocurrency in **Testnet** at the proof-of-stake migration date, in NIM.
 *
 * Same as:
 * powSupplyAfter(powBlockHeightAt(PROOF_OF_STAKE_MIGRATION_DATE))
 */
export const SUPPLY_AT_PROOF_OF_STAKE_MIGRATION_DATE_TESTNET = 12_030_755_339.52899;

/**
 * The block height of the proof-of-stake migration.
 */
export const PROOF_OF_STAKE_MIGRATION_BLOCK = 3456000;

/**
 * The block height of the proof-of-stake migration in **Testnet**.
 */
export const PROOF_OF_STAKE_MIGRATION_BLOCK_TESTNET = 3032010;

/**
 * The initial supply of the cryptocurrency, in Lunas.
 */
export const PROOF_OF_WORK_INITIAL_SUPPLY = 2520000000e5;

/**
 * The speed of the emission curve, in Lunas.
 */
export const PROOF_OF_WORK_EMISSION_SPEED = 4_194_304; // same as powi(2, 22)

/**
 * The block number at which the emission tail starts.
 */
export const PROOF_OF_WORK_EMISSION_TAIL_START = 48692960;

/**
 * The reward per block in the emission tail.
 */
export const PROOF_OF_WORK_EMISSION_TAIL_REWARD = 4000;

export const MAX_SIZE_MICRO_BODY = 100_000;
export const MAX_TX_SENDER_DATA_SIZE = 1;
export const MAX_TX_RECIPIENT_DATA_SIZE = 2112;
export const MAX_BASIC_TX_RECIPIENT_DATA_SIZE = 64;
export const MAX_MERKLE_PATH_SIZE = 1029;
export const MAX_SUPPORTED_WEB_AUTH_SIZE = 512;
export const VERSION = 1;
export const SLOTS = 512;
export const TWO_F_PLUS_ONE = Math.ceil((2 * SLOTS) / 3);
export const F_PLUS_ONE = Math.ceil(SLOTS / 3);
export const MIN_PRODUCER_TIMEOUT = 4 * 1000;
export const BLOCK_SEPARATION_TIME = 1000;
export const TENDERMINT_TIMEOUT_INIT = 4 * 1000;
export const TENDERMINT_TIMEOUT_DELTA = 1000;
export const MIN_EPOCHS_STORED = 1;
export const TIMESTAMP_MAX_DRIFT = 600000;
export const BLOCKS_DELAY_DECAY = 0.9999999989;
export const MINIMUM_REWARDS_PERCENTAGE = 0.5;
export const VALIDATOR_DEPOSIT = 10_000_000_000;
export const MINIMUM_STAKE = 10_000_000;
export const JAIL_EPOCHS = 8;
export const SUPPLY_DECAY = 0.9999999999960264;
export const BLS_CACHE_MAX_CAPACITY = 1000;
export const HISTORY_CHUNKS_MAX_SIZE = 25 * 1024 * 1024;
export const POS_DECAY_PER_DAY = 0.0003432600460362;
export const BLOCKS_PER_BATCH = 60;
export const BATCHES_PER_EPOCH = 720;
export const BLOCKS_PER_EPOCH = BLOCKS_PER_BATCH * BATCHES_PER_EPOCH;
export const STATE_CHUNKS_MAX_SIZE = 1000;
export const TRANSACTION_VALIDITY_WINDOW = 120;
export const TRANSACTION_VALIDITY_WINDOW_BLOCKS = TRANSACTION_VALIDITY_WINDOW * BLOCKS_PER_BATCH;

export const STAKING_CONTRACT_ADDRESS = 'NQ77 0000 0000 0000 0000 0000 0000 0000 0001';
export const COINBASE_ADDRESS = 'NQ81 C01N BASE 0000 0000 0000 0000 0000 0000';
