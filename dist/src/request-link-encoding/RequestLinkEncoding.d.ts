type BigInteger = import('big-integer').BigInteger;
export declare enum Currency {
    NIM = "nim",
    BTC = "btc",
    ETH = "eth",
    MATIC = "matic",
    USDC = "usdc"
}
export declare enum EthereumChain {
    ETHEREUM_MAINNET = 1,
    ETHEREUM_GOERLI_TESTNET = 5,
    POLYGON_MAINNET = 137,
    POLYGON_MUMBAI_TESTNET = 80001
}
export declare const ETHEREUM_SUPPORTED_NATIVE_CURRENCIES: readonly [Currency.ETH, Currency.MATIC];
type EthereumSupportedNativeCurrency = (typeof ETHEREUM_SUPPORTED_NATIVE_CURRENCIES)[number];
export declare const ETHEREUM_SUPPORTED_CONTRACTS: {
    readonly 1: {
        readonly usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
    };
    readonly 5: {
        readonly usdc: "0xde637d4c445ca2aae8f782ffac8d2971b93a4998";
    };
    readonly 137: {
        readonly usdc: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
    };
    readonly 80001: {
        readonly usdc: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23";
    };
};
type EthereumSupportedContractCurrency = keyof ((typeof ETHEREUM_SUPPORTED_CONTRACTS)[keyof typeof ETHEREUM_SUPPORTED_CONTRACTS]);
export declare const ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP: Record<string, [EthereumChain, EthereumSupportedContractCurrency]>;
type EthereumSupportedCurrency = EthereumSupportedNativeCurrency | EthereumSupportedContractCurrency;
export declare enum NimiqRequestLinkType {
    SAFE = "safe",
    URI = "nimiq",
    WEBURI = "web+nim"
}
export interface NimiqRequestLinkOptions {
    amount?: number;
    message?: string;
    label?: string;
    basePath?: string;
    type?: NimiqRequestLinkType;
}
export interface BitcoinRequestLinkOptions {
    amount?: number;
    fee?: number;
    label?: string;
    message?: string;
}
export type EthereumRequestLinkOptions = {
    amount?: number | bigint | BigInteger;
    gasPrice?: number | bigint | BigInteger;
    gasLimit?: number;
} & ({
    chainId: EthereumChain;
    contractAddress: undefined;
} | {
    chainId?: number;
    contractAddress?: string;
});
export type GeneralRequestLinkOptions = ({
    currency: Currency.NIM;
} & NimiqRequestLinkOptions) | ({
    currency: Currency.BTC;
} & BitcoinRequestLinkOptions) | ({
    currency: EthereumSupportedCurrency;
} & EthereumRequestLinkOptions);
export declare function createRequestLink(recipient: string, amountOrOptions?: number | GeneralRequestLinkOptions, // amount in Nim or options object
message?: string, basePath?: string): string;
type ParsedRequestLink<Currencies extends Currency> = (Extract<GeneralRequestLinkOptions, {
    currency: Currencies;
}> | (Currencies extends EthereumSupportedCurrency ? Omit<Extract<GeneralRequestLinkOptions, {
    currency: EthereumSupportedCurrency;
}>, 'currency'> & {
    currency: Extract<Currencies, EthereumSupportedCurrency>;
} : never)) & {
    recipient: string;
};
type AddressChecks<Currencies extends Currency, ReturnType> = Currencies extends Exclude<Currencies, Currency.NIM> ? Partial<Record<Exclude<Currencies | (Currencies extends EthereumSupportedCurrency ? Currency.ETH : never), Currency.NIM | Currency.MATIC | Currency.USDC>, (address: string) => ReturnType>> : never;
export declare function parseRequestLink<C extends Currency>(requestLink: string | URL, options?: {
    currencies?: C[];
    isValidAddress?: AddressChecks<C, boolean>;
    normalizeAddress?: AddressChecks<C, string>;
    expectedNimiqSafeRequestLinkBasePath?: C extends Currency.NIM ? string : never;
}): null | ParsedRequestLink<C>;
export declare function createNimiqRequestLink(recipient: string, options?: NimiqRequestLinkOptions): string;
export declare function parseNimiqSafeRequestLink(requestLink: string | URL, expectedBasePath?: string): null | (NimiqRequestLinkOptions & {
    recipient: string;
});
export declare function parseNimiqUriRequestLink(requestLink: string | URL): null | (NimiqRequestLinkOptions & {
    recipient: string;
});
export declare function createBitcoinRequestLink(recipient: string, // expected to be normalized
options?: BitcoinRequestLinkOptions): string;
export declare function parseBitcoinRequestLink(requestLink: string | URL, isValidAddress?: (address: string) => boolean, normalizeAddress?: (address: string) => string): null | (BitcoinRequestLinkOptions & {
    recipient: string;
});
export declare function createEthereumRequestLink(recipient: string, // addresses only; no support for ENS names; expected to be normalized
currency: EthereumSupportedCurrency, options: EthereumRequestLinkOptions): string;
export declare function parseEthereumRequestLink(requestLink: string | URL, isValidAddress?: (address: string) => boolean, normalizeAddress?: (address: string) => string): null | (EthereumRequestLinkOptions & {
    currency: EthereumSupportedCurrency;
    recipient: string;
});
export {};
