import { ValidationUtils } from '../validation-utils/ValidationUtils';
import { FormattableNumber } from '../formattable-number/FormattableNumber';

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

export const SUPPORTED_TOKENS = {
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
    | ({ currency: Currency.ETH | Currency.MATIC | Currency.USDC } & EthereumRequestLinkOptions);

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

type ParsedRequestLink = GeneralRequestLinkOptions & {
    recipient: string,
}

export function parseRequestLink<C extends Currency.NIM | Currency.BTC>(requestLink: string | URL, options: {
    currencies?: C[], // defaults to all supported currencies
    isValidAddress?: C extends Exclude<C, Currency.NIM> // supported for currencies other than NIM
        ? Partial<Record<Exclude<C, Currency.NIM>, (address: string) => boolean>>
        : never,
    expectedNimiqSafeRequestLinkBasePath?: C extends Currency.NIM ? string : never, // supported for NIM
} = {}): null | Extract<ParsedRequestLink, { currency: C }> {
    const currencies = options.currencies || [Currency.NIM, Currency.BTC];
    const isValidAddress: Partial<Record<Currency, (address: string) => boolean>> = options.isValidAddress || {};
    const { expectedNimiqSafeRequestLinkBasePath } = options;
    const url = toUrl(requestLink);
    if (!url) return null;
    const addCurrencyToResult = (parsedRequestLink: Omit<ParsedRequestLink, 'currency'> | null, currency: Currency)
        : any => (parsedRequestLink ? { ...parsedRequestLink, currency } : null);

    if (currencies.includes(Currency.NIM) && /^(web\+)?nim(iq)?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqUriRequestLink(url), Currency.NIM);
    }
    if (currencies.includes(Currency.NIM) && /^https?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqSafeRequestLink(url, expectedNimiqSafeRequestLinkBasePath), Currency.NIM);
    }
    if (currencies.includes(Currency.BTC) && /^bitcoin:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseBitcoinRequestLink(url, isValidAddress[Currency.BTC]), Currency.BTC);
    }
    return null;
}

export function createNimiqRequestLink(
    recipient: string,
    options: NimiqRequestLinkOptions = { basePath: window.location.host },
): string {
    const { amount, message, label, basePath, type = NimiqRequestLinkType.SAFE } = options;

    if (!ValidationUtils.isValidAddress(recipient)) throw new Error(`Not a valid address: ${recipient}`);
    if (amount && !isUnsignedInteger(amount)) throw new Error(`Not a valid amount: ${amount}`);
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
    const [recipient, amount, message] = optionsSubstr.split('/');

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

    const parsedAmount = params.amount
        ? Math.round(parseFloat(params.amount) * (10 ** DECIMALS[Currency.NIM]))
        : undefined;
    if (typeof parsedAmount === 'number' && Number.isNaN(parsedAmount)) return null;

    const parsedLabel = params.label ? decodeURIComponent(params.label) : undefined;
    const parsedMessage = params.message ? decodeURIComponent(params.message) : undefined;

    return { recipient, amount: parsedAmount, label: parsedLabel, message: parsedMessage };
}

// following BIP21
export function createBitcoinRequestLink(
    recipient: string,
    options: BitcoinRequestLinkOptions = {},
): string {
    if (!recipient) throw new Error('Recipient is required');
    if (options.amount && !isUnsignedInteger(options.amount)) throw new TypeError('Invalid amount');
    if (options.fee && !isUnsignedInteger(options.fee)) throw new TypeError('Invalid fee');
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
    const amount = url.searchParams.get('amount') || undefined;
    const fee = url.searchParams.get('fee') || undefined;
    const label = url.searchParams.get('label') || undefined;
    const message = url.searchParams.get('message') || undefined;

    if (!recipient || (isValidAddress && !isValidAddress(recipient))) return null; // recipient is required

    const parsedAmount = amount ? Math.round(parseFloat(amount) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof parsedAmount === 'number' && Number.isNaN(parsedAmount)) return null;

    const parsedFee = fee ? Math.round(parseFloat(fee) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof parsedFee === 'number' && Number.isNaN(parsedFee)) return null;

    const parsedLabel = label ? decodeURIComponent(label) : undefined;
    const parsedMessage = message ? decodeURIComponent(message) : undefined;

    return { recipient, amount: parsedAmount, fee: parsedFee, label: parsedLabel, message: parsedMessage };
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

export function createEthereumRequestLink(
    recipient: string,
    currency: Currency.ETH | Currency.MATIC | Currency.USDC,
    options: EthereumRequestLinkOptions,
): string {
    if (!recipient) throw new Error('Recipient is required');
    const { amount, gasPrice, gasLimit, chainId, contractAddress } = options;
    if (recipient && !validateEthereumAddress(recipient)) {
        throw new TypeError(`Invalid recipient address: ${recipient}. Valid format: ^0x[a-fA-F0-9]{40}$`);
    }
    if (amount && !isUnsignedInteger(amount)) throw new TypeError('Invalid amount');
    if (gasPrice && !isUnsignedInteger(gasPrice)) throw new TypeError('Invalid gasPrice');
    if (gasLimit && !isUnsignedInteger(gasLimit)) throw new TypeError('Invalid gasLimit');
    if (chainId && !isUnsignedInteger(chainId)) throw new TypeError('Invalid chainId');
    if (contractAddress && !validateEthereumAddress(contractAddress)) {
        throw new TypeError(`Invalid contract address: ${contractAddress}. Valid format: ^0x[a-fA-F0-9]{40}$`);
    }

    const schema = getEthereumBlochainName(chainId || (currency !== Currency.USDC ? currency : undefined));

    let targetAddress = '';
    if (isNativeToken(currency)) {
        targetAddress = recipient;
    } else if (contractAddress) {
        targetAddress = contractAddress;
    } else if (chainId) {
        targetAddress = getContractAddress(chainId, currency);
    } else {
        throw new Error('No contractAddress or chainId provided');
    }

    const chainIdString = chainId !== undefined && chainId !== EthereumChain.ETHEREUM_MAINNET ? `@${chainId}` : '';
    const functionName = currency === Currency.USDC ? '/transfer' : '';

    const query = new URLSearchParams();
    if (!isNativeToken(currency)) {
        // the address parameter is only relevant for ERC20 tokens
        query.set('address', recipient);
    }
    if (amount) {
        const decimals = DECIMALS[currency];
        const formattableNumber = new FormattableNumber(amount);
        formattableNumber.moveDecimalSeparator(-decimals);
        const amountName = isNativeToken(currency) ? 'value' : 'uint256';
        query.set(amountName, `${formattableNumber.toString()}e${decimals}`);
    }
    if (gasPrice) {
        const formattableNumber = new FormattableNumber(gasPrice);
        formattableNumber.moveDecimalSeparator(-9); // render as GWei
        query.set('gasPrice', `${formattableNumber.toString()}e9`);
    }
    if (gasLimit) {
        const formattableNumber = new FormattableNumber(gasLimit);
        query.set('gasLimit', formattableNumber.toString());
    }
    const params = query.toString() ? `?${query.toString()}` : ''; // also urlEncodes the values

    return `${schema}:${targetAddress}${chainIdString}${functionName}${params}`;
}

function isUnsignedInteger(value: number | bigint | BigInteger) {
    if (typeof value === 'number') {
        return Number.isInteger(value) && value >= 0;
    }
    if (typeof value === 'bigint') {
        return value >= 0;
    }
    return !value.isNegative();
}

function getEthereumBlochainName(chainIdOrNativeCurrency?: number | Currency.ETH | Currency.MATIC)
: EthereumBlockchainName {
    switch (chainIdOrNativeCurrency) {
        case EthereumChain.POLYGON_MAINNET:
        case EthereumChain.POLYGON_MUMBAI_TESTNET:
        case Currency.MATIC:
            return EthereumBlockchainName.POLYGON;
        case EthereumChain.ETHEREUM_MAINNET:
        case EthereumChain.ETHEREUM_GOERLI_TESTNET:
        case Currency.ETH:
        default: // To maintain backwards compatibility, default to ethereum, which also conforms to the standard
            return EthereumBlockchainName.ETHEREUM;
    }
}

function validateEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isNativeToken(currency: Currency): boolean {
    return [Currency.ETH, Currency.MATIC].includes(currency);
}

// Return the contract address for the given chainId and currency. If no contract address is known for the given
// chainId and currency, return empty string.
function getContractAddress(chainId: number, currency: Currency) {
    const tokens = SUPPORTED_TOKENS[chainId as keyof typeof SUPPORTED_TOKENS];
    const contractAddress = tokens[currency as unknown as keyof typeof tokens] as string | undefined;
    if (!contractAddress) {
        throw new Error(`Unsupported token: ${currency} on chain ${chainId}.
        You need to specify the 'contractAddress' option.`);
    }
    return contractAddress;
}
