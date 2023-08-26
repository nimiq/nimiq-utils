import { ValidationUtils } from '../validation-utils/ValidationUtils';
import { FormattableNumber, toNonScientificNumberString } from '../formattable-number/FormattableNumber';

// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger;

export enum Currency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
    MATIC = 'matic',
    USDC = 'usdc',
}

const DECIMALS = {
    [Currency.NIM]: 5,
    [Currency.BTC]: 8,
    [Currency.ETH]: 18,
    [Currency.MATIC]: 18,
    [Currency.USDC]: 6,
} as const;

// Uses chain ids as values.
export enum EthereumChain {
    ETHEREUM_MAINNET = 1,
    ETHEREUM_GOERLI_TESTNET = 5,
    POLYGON_MAINNET = 137,
    POLYGON_MUMBAI_TESTNET = 80001,
}

enum EthereumBlockchainName {
    ETHEREUM = 'ethereum',
    POLYGON = 'polygon',
}

export const ETHEREUM_SUPPORTED_NATIVE_CURRENCIES = [Currency.ETH, Currency.MATIC] as const;
type EthereumSupportedNativeCurrency = (typeof ETHEREUM_SUPPORTED_NATIVE_CURRENCIES)[number];

export const ETHEREUM_SUPPORTED_CONTRACTS = {
    [EthereumChain.ETHEREUM_MAINNET]: {
        [Currency.USDC]: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    [EthereumChain.ETHEREUM_GOERLI_TESTNET]: {
        [Currency.USDC]: '0xde637d4c445ca2aae8f782ffac8d2971b93a4998',
    },
    [EthereumChain.POLYGON_MAINNET]: {
        [Currency.USDC]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    },
    [EthereumChain.POLYGON_MUMBAI_TESTNET]: {
        [Currency.USDC]: '0x0fa8781a83e46826621b3bc094ea2a0212e71b23',
    },
} as const;
type EthereumSupportedContractCurrency = keyof (
    (typeof ETHEREUM_SUPPORTED_CONTRACTS)[keyof typeof ETHEREUM_SUPPORTED_CONTRACTS]);
export const ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP
    : Record<string, [EthereumChain, EthereumSupportedContractCurrency]> = {};
for (const [chainId, chainContracts] of Object.entries(ETHEREUM_SUPPORTED_CONTRACTS)) {
    for (const [currency, address] of Object.entries(chainContracts)) {
        ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP[address] = [
            parseInt(chainId, 10),
            currency as EthereumSupportedContractCurrency,
        ];
    }
}

type EthereumSupportedCurrency = EthereumSupportedNativeCurrency | EthereumSupportedContractCurrency;

// for parsing the path part of an eip681 link: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-681.md#syntax
const ETHEREUM_PATH_REGEX = new RegExp('^'
    + '(?:pay-)?' // optional "pay-" suffix of the schema prefix
    + '([^@/?]+)' // mandatory target address
    + '(?:@([^/?]+))?' // optional chain id
    + '(?:/([^?]+))?' // optional function name
    + '$');

export enum NimiqRequestLinkType {
    SAFE = 'safe', // Nimiq Safe format: https://safe.nimiq.com/#_request/...
    URI = 'nimiq', // BIP-21 URI format: nimiq:<address>?amount=...
    WEBURI = 'web+nim', // BIP-21 URI for web format: web+nim://<address>?amount=...
}

export interface NimiqRequestLinkOptions {
    amount?: number, // in luna
    message?: string,
    label?: string,
    basePath?: string,
    type?: NimiqRequestLinkType,
}

export interface BitcoinRequestLinkOptions {
    amount?: number, // in Satoshi
    fee?: number, // suggested fee in Satoshi, might be ignored
    label?: string,
    message?: string,
}

export type EthereumRequestLinkOptions = {
    amount?: number | bigint | BigInteger, // in Wei. To avoid js number limitations, usage of BigInt is recommendable
    gasPrice?: number | bigint | BigInteger, // in Wei. To avoid js number limitations, usage of BigInt is recommendable
    gasLimit?: number, // integer in gas units, same as parameter 'gas' as specified in EIP681
} & (
        {
            chainId: EthereumChain,
            contractAddress: undefined
        } | {
            chainId?: number,
            // Explicitly specify the contract address to send the transaction to.
            // Otherwise, the address is derived from the chainId and the currency.
            contractAddress?: string
        }
    );

export type GeneralRequestLinkOptions =
    ({ currency: Currency.NIM } & NimiqRequestLinkOptions)
    | ({ currency: Currency.BTC } & BitcoinRequestLinkOptions)
    | ({ currency: EthereumSupportedCurrency } & EthereumRequestLinkOptions);

// Can be used with an options object or with the legacy function signature for creating a Nim request link.
// If using the legacy function signature, amountOrOptions can be given as a value in Nim.
export function createRequestLink(
    recipient: string,
    amountOrOptions?: number | GeneralRequestLinkOptions, // amount in Nim or options object
    message?: string,
    basePath: string = window.location.host,
): string {
    if (typeof amountOrOptions === 'object') {
        switch (amountOrOptions.currency) {
            case Currency.NIM:
                return createNimiqRequestLink(recipient, amountOrOptions);
            case Currency.BTC:
                return createBitcoinRequestLink(recipient, amountOrOptions);
            case Currency.ETH:
            case Currency.MATIC:
            case Currency.USDC:
                return createEthereumRequestLink(recipient, amountOrOptions.currency, amountOrOptions);
            default:
                throw new Error('Unsupported currency.');
        }
    }
    const amount = typeof amountOrOptions !== 'undefined'
        ? amountOrOptions * (10 ** DECIMALS[Currency.NIM])
        : undefined;
    return createNimiqRequestLink(recipient, { amount, message, basePath });
}

type ParsedRequestLink<Currencies extends Currency> = (
    // for if Currencies includes Currency.NIM, Currency.BTC or EthereumSupportedCurrency
    Extract<GeneralRequestLinkOptions, { currency: Currencies }>
    // for if Currencies includes a subset of EthereumSupportedCurrency
    // Restrict currency in return type to Currencies.
    | (Currencies extends EthereumSupportedCurrency
        ? Omit<
            Extract<GeneralRequestLinkOptions, { currency: EthereumSupportedCurrency }>,
            'currency'
        > & { currency: Extract<Currencies, EthereumSupportedCurrency> }
        : never
    )
) & {
    recipient: string,
};

export function parseRequestLink<C extends Currency>(requestLink: string | URL, options: {
    currencies?: C[], // defaults to all supported currencies
    isValidAddress?: C extends Exclude<C, Currency.NIM> // Supported for currencies other than NIM. MATIC and USDC use
        // the entry for ETH if provided.
        ? Partial<Record<Exclude<C, Currency.NIM | Currency.MATIC | Currency.USDC>, (address: string) => boolean>>
        : never,
    expectedNimiqSafeRequestLinkBasePath?: C extends Currency.NIM ? string : never, // supported for NIM
} = {}): null | ParsedRequestLink<C> {
    const currencies = options.currencies || Object.values(Currency);
    const isValidAddress: Partial<Record<Currency, (address: string) => boolean>> = options.isValidAddress || {};
    const { expectedNimiqSafeRequestLinkBasePath } = options;
    const url = toUrl(requestLink);
    if (!url) return null;
    const addCurrencyToResult = (parsedRequestLink: Omit<ParsedRequestLink<any>, 'currency'> | null, currency: Currency)
        : any | null => (parsedRequestLink ? { ...parsedRequestLink, currency } : null);

    if (currencies.includes(Currency.NIM) && /^(web\+)?nim(iq)?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqUriRequestLink(url), Currency.NIM);
    }
    if (currencies.includes(Currency.NIM) && /^https?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqSafeRequestLink(url, expectedNimiqSafeRequestLinkBasePath), Currency.NIM);
    }
    if (currencies.includes(Currency.BTC) && /^bitcoin:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseBitcoinRequestLink(url, isValidAddress[Currency.BTC]), Currency.BTC);
    }
    if ([...ETHEREUM_SUPPORTED_NATIVE_CURRENCIES, Currency.USDC].some((currency) => currencies.includes(currency))
        && new RegExp(`^(${Object.values(EthereumBlockchainName).join('|')}):$`, 'i').test(url.protocol)) {
        const parsedRequestLink = parseEthereumRequestLink(url, isValidAddress[Currency.ETH]);
        if (parsedRequestLink && currencies.includes(parsedRequestLink.currency)) {
            return parsedRequestLink as ParsedRequestLink<C>;
        }
    }
    return null;
}

export function createNimiqRequestLink(
    recipient: string,
    options: NimiqRequestLinkOptions = { basePath: window.location.host },
): string {
    const { amount, message, label, basePath, type = NimiqRequestLinkType.SAFE } = options;

    if (!ValidationUtils.isValidAddress(recipient)) throw new Error(`Not a valid address: ${recipient}`);
    if (amount && !isUnsignedSafeInteger(amount)) throw new Error(`Not a valid amount: ${amount}`);
    if (message && typeof message !== 'string') throw new Error(`Not a valid message: ${message}`);
    if (label && typeof label !== 'string') throw new Error(`Not a valid label: ${label}`);

    const amountNim = amount
        ? new FormattableNumber(amount).moveDecimalSeparator(-DECIMALS[Currency.NIM]).toString()
        : '';

    // Assemble params
    const query = [['recipient', recipient.replace(/ /g, '')]]; // strip spaces from address
    if (amountNim || message || label) query.push(['amount', amountNim || '']);
    if (message || label) query.push(['message', encodeURIComponent(message || '')]);
    if (label) query.push(['label', encodeURIComponent(label)]);

    // Create Safe-style `https://` links
    // Note that the encoding scheme for Safe-style links is the same as
    // for Safe XRouter aside route parameters (see _makeAside).
    if (type === NimiqRequestLinkType.SAFE) {
        const params = query.map((param) => param[1]);
        return `${basePath}${!basePath!.endsWith('/') ? '/' : ''}#_request/${params.join('/')}_`;
    }

    // Create URI scheme `nimiq:` links
    if (type === NimiqRequestLinkType.URI || type === NimiqRequestLinkType.WEBURI) {
        const address = query.shift()![1];
        const params = query.map(([key, param]) => `${key}=${param}`);
        return `${type}:${address}${params.length ? '?' : ''}${params.join('&')}`;
    }

    throw new Error(`Unknown type: ${type}`);
}

export function parseNimiqSafeRequestLink(
    requestLink: string | URL,
    expectedBasePath?: string,
): null | (NimiqRequestLinkOptions & { recipient: string }) {
    const url = toUrl(requestLink);
    if (!url || (expectedBasePath && url.host !== expectedBasePath)) return null;

    // check whether it's a request link
    const requestRegex = /_request\/(([^/]+)(\/[^/]*){0,2})_/;
    const requestRegexMatch = url.hash.match(requestRegex);
    if (!requestRegexMatch) return null;

    // parse options
    const optionsSubstr = requestRegexMatch[1];
    const [recipient, amount, message] = optionsSubstr.split('/')
        .map((part) => (part ? decodeURIComponent(part) : part));

    return parseNimiqParams({ recipient, amount, message });
}

export function parseNimiqUriRequestLink(requestLink: string | URL)
: null | (NimiqRequestLinkOptions & { recipient: string }) {
    const url = toUrl(requestLink);
    if (!url || !/^(web\+)?nim(iq)?:$/i.test(url.protocol)) return null;

    // Fetch options
    const recipient = url.pathname;
    const amount = url.searchParams.get('amount') || undefined;
    const label = url.searchParams.get('label') || undefined;
    const message = url.searchParams.get('message') || undefined;

    return parseNimiqParams({ recipient, amount, label, message });
}

type NimiqParams = { recipient: string, amount?: string, label?: string, message?: string };
type ParsedNimiqParams = Omit<NimiqParams, 'amount'> & { amount?: number };

function parseNimiqParams(params: NimiqParams): ParsedNimiqParams | null {
    const recipient = params.recipient
        .replace(/[ +-]|%20/g, '') // strip spaces and dashes
        .replace(/(.)(?=(.{4})+$)/g, '$1 '); // reformat with spaces, forming blocks of 4 chars
    if (!ValidationUtils.isValidAddress(recipient)) return null; // recipient is required

    const amount = params.amount ? Math.round(parseFloat(params.amount) * (10 ** DECIMALS[Currency.NIM])) : undefined;
    if (typeof amount === 'number' && !isUnsignedSafeInteger(amount)) return null;

    const { label, message } = params;

    return { recipient, amount, label, message };
}

// following BIP21
export function createBitcoinRequestLink(
    recipient: string,
    options: BitcoinRequestLinkOptions = {},
): string {
    if (!recipient) throw new Error('Recipient is required');
    if (options.amount && !isUnsignedSafeInteger(options.amount)) throw new TypeError('Invalid amount');
    if (options.fee && !isUnsignedSafeInteger(options.fee)) throw new TypeError('Invalid fee');
    const query: string[] = [];
    const validQueryKeys: ['amount', 'fee', 'label', 'message'] = ['amount', 'fee', 'label', 'message'];
    validQueryKeys.forEach((key) => {
        const option = options[key];
        if (!option) return;
        // formatted value in BTC without scientific number notation
        const formattedValue = key === 'amount' || key === 'fee'
            ? new FormattableNumber(option).moveDecimalSeparator(-DECIMALS[Currency.BTC]).toString()
            : encodeURIComponent(option.toString());
        query.push(`${key}=${formattedValue}`);
    }, '');
    const queryString = query.length ? `?${query.join('&')}` : '';
    return `bitcoin:${recipient}${queryString}`;
}

export function parseBitcoinRequestLink(requestLink: string | URL, isValidAddress?: (address: string) => boolean)
: null | (BitcoinRequestLinkOptions & { recipient: string }) {
    const url = toUrl(requestLink);
    if (!url || !/^bitcoin:$/i.test(url.protocol)) return null;

    const recipient = url.pathname;
    const rawAmount = url.searchParams.get('amount');
    const rawFee = url.searchParams.get('fee');
    const label = url.searchParams.get('label') || undefined;
    const message = url.searchParams.get('message') || undefined;

    if (!recipient || (isValidAddress && !isValidAddress(recipient))) return null; // recipient is required

    const amount = rawAmount ? Math.round(parseFloat(rawAmount) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof amount === 'number' && !isUnsignedSafeInteger(amount)) return null;

    const fee = rawFee ? Math.round(parseFloat(rawFee) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof fee === 'number' && !isUnsignedSafeInteger(fee)) return null;

    return { recipient, amount, fee, label, message };
}

// Following eip681. ETH, Matic and USDC (both on Ethereum and Polygon) are directly supported. For other currencies, a
// custom contract address can be manually specified. However, the only supported smart contract function is /transfer.
// Deviating from the standard, we use polygon: instead of ethereum: as protocol for requests on the Polygon chain which
// is what many other wallets and exchanges do, too.
export function createEthereumRequestLink(
    recipient: string, // addresses only; no support for ENS names
    currency: EthereumSupportedCurrency,
    options: EthereumRequestLinkOptions,
): string {
    const { amount, gasPrice, gasLimit, chainId } = options;
    const contractAddress = options.contractAddress
        || (chainId ? getEthereumContractAddress(chainId, currency) : undefined);
    if (!recipient || !validateEthereumAddress(recipient)) {
        throw new TypeError(`Invalid recipient address: ${recipient}.`);
    }
    if (amount && !isUnsignedSafeInteger(amount)) throw new TypeError('Invalid amount');
    if (gasPrice && !isUnsignedSafeInteger(gasPrice)) throw new TypeError('Invalid gasPrice');
    if (gasLimit && !isUnsignedSafeInteger(gasLimit)) throw new TypeError('Invalid gasLimit');
    if (chainId && !isUnsignedSafeInteger(chainId)) throw new TypeError('Invalid chainId');
    if (contractAddress && !validateEthereumAddress(contractAddress)) {
        throw new TypeError(`Invalid contract address: ${contractAddress}.`);
    }

    const [contractChainId] = (contractAddress ? getEthereumContractInfo(contractAddress) : null)
        || [] as undefined[];
    if (chainId !== undefined && contractChainId !== undefined && chainId !== contractChainId) {
        // The chain id does not match the chain id associated to the known contract address, which is possible as it's
        // also a valid address on other chain ids, but very unlikely the user's intention.
        throw new Error('chainId does not match chain id associated to contractAddress');
    }

    // For determining the protocol, (known) chain ids have the highest priority, because they indisputably identify the
    // chain/protocol. Then, the chain ids associated to our known contracts. If the user passed no known chain id or
    // contract address, or custom ones for which we don't know the associated blockchain name, the protocol is
    // determined based on the (native) currency, such that the user can pick the protocol via the currency. If the
    // protocol can't be determined based on these checks, we fall back to "ethereum:" which is valid for all chain ids,
    // according to the standard.
    const blockchainName = (chainId ? getEthereumBlockchainName(chainId) : null)
        || (contractChainId ? getEthereumBlockchainName(contractChainId) : null)
        || getEthereumBlockchainName(currency)
        || EthereumBlockchainName.ETHEREUM;
    const protocol = `${blockchainName}:`;

    let targetAddress: string;
    if (contractAddress) {
        // For determining the target address, the contractAddress has priority, even if the requested currency is a
        // native currency, as the user might have provided a custom contractAddress, and the native currency just to
        // determine the protocol.
        targetAddress = contractAddress;
    } else if (isNativeEthereumCurrency(currency)) {
        targetAddress = recipient;
    } else {
        // Not a native currency, and no contractAddress, or chainId from which the contractAddress could be determined
        // in the beginning was passed.
        throw new Error(`No contractAddress or chainId provided for ${currency} transaction`);
    }

    const isContract = !!contractAddress;
    const chainIdString = chainId !== undefined && chainId !== EthereumChain.ETHEREUM_MAINNET ? `@${chainId}` : '';
    const functionString = isContract ? '/transfer' : '';

    const query = new URLSearchParams();
    if (isContract) {
        query.set('address', recipient);
    }
    if (amount) {
        const decimals = DECIMALS[currency];
        const formattableNumber = new FormattableNumber(amount);
        formattableNumber.moveDecimalSeparator(-decimals);
        const amountParam = isContract ? 'uint256' : 'value';
        query.set(amountParam, `${formattableNumber.toString()}e${decimals}`);
    }
    if (gasPrice) {
        // Gas price is in native currency, currently ETH or Matic, which both have 18 decimals. Render as GWei.
        const formattableNumber = new FormattableNumber(gasPrice);
        formattableNumber.moveDecimalSeparator(-9);
        query.set('gasPrice', `${formattableNumber.toString()}e9`);
    }
    if (gasLimit) {
        query.set('gasLimit', toNonScientificNumberString(gasLimit));
    }
    const params = query.toString() ? `?${query.toString()}` : ''; // also urlEncodes the values

    return `${protocol}${targetAddress}${chainIdString}${functionString}${params}`;
}

// Following eip681. Support is limited to ETH, Matic and USDC (both on Ethereum and Polygon) and /transfer as the only
// contract function. Scanning request links for contracts other than those defined in ETHEREUM_SUPPORTED_CONTRACTS or
// chain ids not defined in the EthereumChain enum is not supported as those might refer to a currency other than the
// supported ones. If support for that would be needed in the future, undefined could be returned as currency, alongside
// the parsed chain id and/or contract address.
export function parseEthereumRequestLink(
    requestLink: string | URL,
    isValidAddress: (address: string) => boolean = validateEthereumAddress,
): null | (EthereumRequestLinkOptions & {
    currency: EthereumSupportedCurrency,
    recipient: string,
}) {
    const url = toUrl(requestLink);
    if (!url
        || !new RegExp(`^(${Object.values(EthereumBlockchainName).join('|')}):$`, 'i').test(url.protocol)) return null;

    const [, targetAddress, rawChainId, rawFunctionName] = url.pathname.match(ETHEREUM_PATH_REGEX) || [] as undefined[];

    if (!targetAddress || !isValidAddress(targetAddress)) return null; // target address is required

    // Note that we limit support of contract request links to contracts specified in ETHEREUM_SUPPORTED_CONTRACTS
    const contractInfo = getEthereumContractInfo(targetAddress);
    const [contractChainId, contractCurrency] = contractInfo || [] as undefined[];
    const isContract = !!contractInfo;
    const contractAddress = isContract ? targetAddress : undefined;

    const chainId = rawChainId ? parseInt(rawChainId, 10) : (
        contractChainId
        // Guess the chain from the protocol. If the protocol is 'ethereum:' don't assume the ethereum chain though,
        // because it's a valid protocol for other chains too, according to the standard.
        || (url.protocol === `${EthereumBlockchainName.POLYGON}:` ? EthereumChain.POLYGON_MAINNET : undefined)
    );
    if (typeof chainId === 'number' && (
        !isUnsignedSafeInteger(chainId)
        || !Object.values(EthereumChain).includes(chainId)
        // While technically the contract id is a valid address, regular or for another contract, on other chain ids,
        // it is highly unlikely that it's actually the user's intention to receive funds there.
        || (typeof contractChainId === 'number' && chainId !== contractChainId)
    )) return null;

    const currency = contractCurrency
        || (chainId ? getEthereumCurrency(chainId) : undefined)
        // Fallback to the protocol, which was checked to contain a valid EthereumBlockchainName in the beginning.
        || getEthereumCurrency(url.protocol.match(/[^:]+/)![0].toLowerCase() as EthereumBlockchainName);

    const functionName = rawFunctionName ? decodeURIComponent(rawFunctionName) : undefined;
    if ((!!functionName !== isContract) || (functionName && functionName !== 'transfer')) {
        // A functionName needs to be specified for contracts, and a supported contract needs to be detected if a
        // functionName is set. Additionally, the only supported contract function is transfer.
        return null;
    }

    const contractRecipient = url.searchParams.get('address');
    const rawAmount = url.searchParams.get(isContract ? 'uint256' : 'value');
    const rawGasPrice = url.searchParams.get('gasPrice');
    const rawGasLimit = url.searchParams.get('gasLimit');

    if ((!!contractRecipient !== isContract) || (contractRecipient && !isValidAddress(contractRecipient))) return null;
    const recipient = contractRecipient || targetAddress;

    let amount: number | bigint | undefined;
    let gasPrice: number | bigint | undefined;
    let gasLimit: number | undefined;
    try {
        amount = rawAmount ? parseUnsignedInteger(rawAmount) : undefined;
        gasPrice = rawGasPrice ? parseUnsignedInteger(rawGasPrice) : undefined;
        const parsedGasLimit = rawGasLimit ? parseUnsignedInteger(rawGasLimit) : undefined;
        if (typeof parsedGasLimit === 'bigint') return null;
        gasLimit = parsedGasLimit;
    } catch (e) {
        return null;
    }

    return { currency, recipient, amount, gasPrice, gasLimit, chainId, contractAddress };
}

function toUrl(link: string | URL): null | URL {
    if (link instanceof URL) return link;

    if (!link.includes(':')) {
        // If the link does not include a protocol, include a protocol to be parseable as URL. We assume https by
        // default, but it could be any dummy protocol. The // after the : can be omitted. If a request link format
        // requires a specific protocol, it is checked by the parsing method itself.
        link = `https:${link}`;
    }

    try {
        return new URL(link);
    } catch (e) {
        return null;
    }
}

function isUnsignedSafeInteger(value: number | bigint | BigInteger): boolean {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) && value >= 0;
    }
    if (typeof value === 'bigint') {
        return value >= 0;
    }
    return !value.isNegative();
}

function parseUnsignedInteger(value: string): number | bigint {
    value = toNonScientificNumberString(value); // Resolves scientific notation and throws for invalid number strings.
    let result: number | bigint = parseFloat(value); // Parse to a number first, for browsers without bigint support.
    if (result < 0) throw new Error('Value is negative');
    if (!Number.isSafeInteger(result)) {
        // Non-integer, non-safe integer larger than Number.MAX_SAFE_INTEGER or NaN (which it can't really be as
        // toNonScientificNumberString parses only valid numbers). Try parsing again as bigint, which supports integers
        // above Number.MAX_SAFE_INTEGER, and throws for actual invalid or non-integer numbers.
        result = BigInt(value); // eslint-disable-line no-undef
    }
    return result;
}

function isNativeEthereumCurrency(currency: Currency): currency is EthereumSupportedNativeCurrency {
    return (ETHEREUM_SUPPORTED_NATIVE_CURRENCIES as readonly Currency[]).includes(currency);
}

function validateEthereumAddress(address: string): boolean {
    return /^0x[a-f0-9]{40}$/i.test(address);
}

function getEthereumBlockchainName(chainIdOrNativeCurrency: number | Currency)
: null | EthereumBlockchainName {
    switch (chainIdOrNativeCurrency) {
        case EthereumChain.ETHEREUM_MAINNET:
        case EthereumChain.ETHEREUM_GOERLI_TESTNET:
        case Currency.ETH:
            return EthereumBlockchainName.ETHEREUM;
        case EthereumChain.POLYGON_MAINNET:
        case EthereumChain.POLYGON_MUMBAI_TESTNET:
        case Currency.MATIC:
            return EthereumBlockchainName.POLYGON;
        default: // don't make any assumption for unknown chainIds or non-native Ethereum currencies
            return null;
    }
}

function getEthereumCurrency(chainIdOrBlockchainName: number): null | EthereumSupportedNativeCurrency;
function getEthereumCurrency(chainIdOrBlockchainName: EthereumBlockchainName): EthereumSupportedNativeCurrency;
function getEthereumCurrency(chainIdOrBlockchainName: number | EthereumBlockchainName)
: null | EthereumSupportedNativeCurrency {
    switch (chainIdOrBlockchainName) {
        case EthereumChain.ETHEREUM_MAINNET:
        case EthereumChain.ETHEREUM_GOERLI_TESTNET:
        case EthereumBlockchainName.ETHEREUM:
            return Currency.ETH;
        case EthereumChain.POLYGON_MAINNET:
        case EthereumChain.POLYGON_MUMBAI_TESTNET:
        case EthereumBlockchainName.POLYGON:
            return Currency.MATIC;
        default: // don't make any assumption for unknown chainIds or blockchain names
            return null;
    }
}

// Return known contract address for the given chainId and currency.
function getEthereumContractAddress(chainId: number, currency: Currency): null | string {
    if (isNativeEthereumCurrency(currency)) return null;
    const contracts = ETHEREUM_SUPPORTED_CONTRACTS[chainId as keyof typeof ETHEREUM_SUPPORTED_CONTRACTS];
    if (!contracts) {
        throw new Error(`Unsupported chainId: ${chainId}. You need to specify the 'contractAddress' option.`);
    }
    const contractAddress = contracts[currency as unknown as keyof typeof contracts] as string | undefined;
    if (!contractAddress) {
        throw new Error(`Unsupported contract: ${currency} on chain ${chainId}. `
            + 'You need to specify the \'contractAddress\' option.');
    }
    return contractAddress;
}

// Return the chainId and currency for known contract address.
function getEthereumContractInfo(contractAddress: string): null | [EthereumChain, EthereumSupportedContractCurrency] {
    return ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP[contractAddress.toLowerCase()] || null;
}
