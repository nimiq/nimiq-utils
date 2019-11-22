import { ValidationUtils } from '../validation-utils/ValidationUtils';
import { FormattableNumber } from '../formattable-number/FormattableNumber';

// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger;

export const enum Currency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
}

const NIM_DECIMALS = 5;
const BTC_DECIMALS = 8;
const ETH_DECIMALS = 18;

export const enum NimiqRequestLinkType {
    SAFE ='safe', // Nimiq Safe format: https://safe.nimiq.com/#_request/...
    URI = 'uri', // URI format: nimiq:<address>?amount=...
    WEBURI = 'web+uri', // BIP-21 for web format: web+nim://<address>?amount=...
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
    fee?: number, // suggested fee in BTC, might be ignored
    label?: string,
    message?: string,
}

export interface EthereumRequestLinkOptions {
    amount?: number | bigint | BigInteger, // in Wei. To avoid js number limitations, usage of BigInt is recommendable
    gasPrice?: number | bigint | BigInteger, // in Wei. To avoid js number limitations, usage of BigInt is recommendable
    gasLimit?: number, // integer in gas units, same as parameter 'gas' as specified in EIP681
    chainId?: number,
}

export type GeneralRequestLinkOptions =
    NimiqRequestLinkOptions & { currency: Currency.NIM }
    | BitcoinRequestLinkOptions & { currency: Currency.BTC }
    | EthereumRequestLinkOptions & { currency: Currency.ETH };

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
                return createEthereumRequestLink(recipient, amountOrOptions);
            default:
                throw new Error('Unsupported currency.');
        }
    }
    const amount = typeof amountOrOptions !== 'undefined' ? amountOrOptions * (10 ** NIM_DECIMALS) : undefined;
    return createNimiqRequestLink(recipient, { amount, message, basePath });
}

interface LegacyParsedRequestLink {
    recipient: string,
    amount: number | null,
    message: string | null,
}

interface ParsedRequestLink extends NimiqRequestLinkOptions {
    recipient: string,
}

export function parseRequestLink(requestLink: string | URL, requiredBasePath?: string, useNewApi?: false)
    : null | LegacyParsedRequestLink; // legacy function signature
export function parseRequestLink(requestLink: string | URL, requiredBasePath: string | undefined, useNewApi: true)
    : null | ParsedRequestLink;
export function parseRequestLink(
    requestLink: string | URL,
    requiredBasePath?: string,
    useNewApi?: boolean, // temporary option to distinguish legacy usage that returned amount in NIM
): null | ParsedRequestLink | LegacyParsedRequestLink {
    const protocol = requestLink instanceof URL
        ? requestLink.protocol
        : (requestLink.match(/^[^:]+:/) || ['https:'])[0];

    if (!/^http(s)?:$/i.test(protocol) && !isNimiqUriProtocol(protocol)) {
        // currently only nimiq web link parsing supported
        throw new Error(`Parsing links for protocol ${protocol} is currently not supported.`);
    }

    if (!useNewApi) {
        // eslint-disable-next-line no-console
        console.warn('parseRequestLink with amounts in NIM and null for non-existing values has been deprecated. '
            + 'Please set useNewApi to true to signal usage of the new parseRequestLink method. Note that useNewApi '
            + 'is a temporary flag that will be removed once parseRequestLink switches to returning amounts in '
            + 'the smallest unit and undefined for non-existing values by default after a transition period.');
    }

    let parsedNimiqRequestLink;

    if (isNimiqUriProtocol(protocol)) {
        parsedNimiqRequestLink = parseNimiqUriRequestLink(requestLink);
    } else {
        parsedNimiqRequestLink = parseNimiqSafeRequestLink(requestLink, requiredBasePath);
    }

    if (useNewApi || !parsedNimiqRequestLink) return parsedNimiqRequestLink;

    const { recipient, amount, message } = parsedNimiqRequestLink;
    const amountNim = amount ? amount / (10 ** NIM_DECIMALS) : amount;

    return {
        recipient,
        amount: amountNim || null,
        message: message || null,
    };
}

export function createNimiqRequestLink(
    recipient: string,
    options: NimiqRequestLinkOptions = { basePath: window.location.host },
): string {
    const { amount, message, label, type = NimiqRequestLinkType.SAFE } = options;
    let basePath = options.basePath; // eslint-disable-line prefer-destructuring

    if (!ValidationUtils.isValidAddress(recipient)) throw new Error(`Not a valid address: ${recipient}`);
    if (amount && !isUnsignedInteger(amount)) throw new Error(`Not a valid amount: ${amount}`);
    if (message && typeof message !== 'string') throw new Error(`Not a valid message: ${message}`);
    if (label && typeof label !== 'string') throw new Error(`Not a valid label: ${label}`);

    const amountNim = amount ? new FormattableNumber(amount).moveDecimalSeparator(-NIM_DECIMALS).toString() : '';

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
        if (!basePath!.endsWith('/')) basePath = `${basePath}/`;
        return `${basePath}#_request/${params.join('/')}_`;
    }

    // Create URI scheme `nimiq:` links
    if (type === NimiqRequestLinkType.URI || type === NimiqRequestLinkType.WEBURI) {
        const protocol = {
            [NimiqRequestLinkType.URI]: 'nimiq:',
            [NimiqRequestLinkType.WEBURI]: 'web+nim:',
        }[type];
        const address = query.shift()![1];
        const params = query.map(([key, param]) => `${key}=${param}`);
        return `${protocol}${address}${params.length ? '?' : ''}${params.join('&')}`;
    }

    throw new Error(`Unknown type: ${type}`);
}

export function parseNimiqSafeRequestLink(
    requestLink: string | URL,
    requiredBasePath?: string,
): null | ParsedRequestLink {
    const url = toUrl(requestLink, '://');
    if (!url || (requiredBasePath && url.host !== requiredBasePath)) return null;

    // check whether it's a request link
    const requestRegex = /_request\/(([^/]+)(\/[^/]*){0,2})_/;
    const requestRegexMatch = url.hash.match(requestRegex);
    if (!requestRegexMatch) return null;

    // parse options
    const optionsSubstr = requestRegexMatch[1];
    const [recipient, amount, message] = optionsSubstr.split('/');

    return parseNimiqParams({ recipient, amount, message });
}

export function parseNimiqUriRequestLink(requestLink: string | URL): null | ParsedRequestLink {
    const url = toUrl(requestLink, ':');
    if (!url) return null;

    // Fetch options
    const recipient = url.pathname;
    const amount = url.searchParams.get('amount') || undefined;
    const message = url.searchParams.get('message') || undefined;

    return parseNimiqParams({ recipient, amount, message });
}

function toUrl(link: string | URL, requiredChars: string): null | URL {
    if (link instanceof URL) return link;

    if (!link.includes(requiredChars)) {
        // The protocol doesn't matter after this function, so we add
        // a dummy protocol, so that the string parses as an URL.
        link = `dummy${requiredChars}${link}`;
    }

    try {
        return new URL(link);
    } catch (e) {
        return null;
    }
}

type NimiqParams = { recipient: string, amount?: string, message?: string };
type ParsedNimiqParams = Omit<NimiqParams, 'amount'> & {amount?: number};

function parseNimiqParams(params: NimiqParams): ParsedNimiqParams | null {
    const recipient = params.recipient
        .replace(/[ +-]|%20/g, '') // strip spaces and dashes
        .replace(/(.)(?=(.{4})+$)/g, '$1 '); // reformat with spaces, forming blocks of 4 chars
    if (!ValidationUtils.isValidAddress(recipient)) return null; // recipient is required

    const parsedAmount = params.amount ? parseFloat(params.amount) * (10 ** NIM_DECIMALS) : undefined;
    if (typeof parsedAmount === 'number' && Number.isNaN(parsedAmount)) return null;

    const parsedMessage = params.message ? decodeURIComponent(params.message) : undefined;

    return { recipient, amount: parsedAmount, message: parsedMessage };
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
            ? new FormattableNumber(option).moveDecimalSeparator(-BTC_DECIMALS).toString()
            : encodeURIComponent(option.toString());
        query.push(`${key}=${formattedValue}`);
    }, '');
    const queryString = query.length ? `?${query.join('&')}` : ''; // also urlEncodes the values
    return `bitcoin:${recipient}${queryString}`;
}

// subset of EIP681
export function createEthereumRequestLink(
    recipient: string, // ETH address or ENS name
    options: EthereumRequestLinkOptions = {},
): string {
    if (!recipient) throw new Error('Recipient is required');
    const { amount: value, gasPrice, gasLimit, chainId } = options;
    if (value && !isUnsignedInteger(value)) throw new TypeError('Invalid amount');
    if (gasPrice && !isUnsignedInteger(gasPrice)) throw new TypeError('Invalid gasPrice');
    if (gasLimit && !isUnsignedInteger(gasLimit)) throw new TypeError('Invalid gasLimit');
    const eip831Prefix = !recipient.startsWith('0x') ? 'pay-' : '';
    const chainIdString = chainId !== undefined ? `@${chainId}` : '';
    const query = new URLSearchParams();
    const queryOptions: { [key: string]: number | bigint | BigInteger | undefined } = { value, gasLimit, gasPrice };
    Object.keys(queryOptions).forEach((key) => {
        const option = queryOptions[key];
        if (!option) return;
        // format Wei values with scientific number notation as recommended by EIP681
        const formattableNumber = new FormattableNumber(option);
        let formattedNumber;
        if (key === 'value') {
            formattableNumber.moveDecimalSeparator(-ETH_DECIMALS); // render as ETH
            formattedNumber = `${formattableNumber.toString()}e${ETH_DECIMALS}`;
        } else if (key === 'gasPrice') {
            formattableNumber.moveDecimalSeparator(-9); // render as GWei
            formattedNumber = `${formattableNumber.toString()}e9`;
        } else {
            formattedNumber = formattableNumber.toString();
        }
        query.set(key, formattedNumber);
    }, '');
    const queryString = query.toString() ? `?${query.toString()}` : ''; // also urlEncodes the values
    return `ethereum:${eip831Prefix}${recipient}${chainIdString}${queryString}`;
}

function isNimiqUriProtocol(link: string): boolean {
    return /^(web\+)?nim(iq)?:$/i.test(link);
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
