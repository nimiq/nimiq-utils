import { ValidationUtils } from "../validation-utils/ValidationUtils";

const enum Currency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
}

export interface NimiqRequestLinkOptions {
    amount?: number, // in NIM
    message?: string,
    basePath?: string,
}

export interface BitcoinRequestLinkOptions {
    amount?: number, // in BTC
    fee?: number, // suggested fee in BTC, might be ignored
    label?: string,
    message?: string,
}

export interface EthereumRequestLinkOptions {
    // Note that ETH values are limited to JS number precision
    amount?: number, // in ETH
    gasPrice?: number, // in ETH
    gasLimit?: number, // integer in gas units, same as parameter 'gas' as specified in EIP681
    chainId?: number,
}

export type GeneralRequestLinkOptions =
    NimiqRequestLinkOptions & { currency: Currency.NIM }
    | BitcoinRequestLinkOptions & { currency: Currency.BTC }
    | EthereumRequestLinkOptions & { currency: Currency.ETH };

// Can be used with an options object or with the legacy function signature for creating a Nim request link
export function createRequestLink(
    recipient: string,
    amountOrOptions?: number | GeneralRequestLinkOptions, // amount in Nim or options object
    message?: string,
    basePath: string = window.location.host,
) {
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
    return createNimiqRequestLink(recipient, { amount: amountOrOptions, message, basePath });
}

export function parseRequestLink(
    requestLink: string | URL,
    requiredBasePath?: string,
) {
    const protocol = requestLink instanceof URL
        ? requestLink.protocol
        : (requestLink.match(/^[^:]+:/) || ['https:'])[0];
    if (!/^http(s)?:$/i.test(protocol)) {
        // currently only nimiq web link parsing supported
        throw new Error(`Parsing links for protocol ${protocol} is currently not supported.`);
    }
    return parseNimiqRequestLink(requestLink, requiredBasePath);
}

// Note that the encoding scheme is the same as for Safe XRouter aside route parameters (see _makeAside).
export function createNimiqRequestLink(
    recipient: string,
    options: NimiqRequestLinkOptions = { basePath: window.location.host },
) {
    let { amount, message, basePath } = options;
    if (!ValidationUtils.isValidAddress(recipient)) throw new Error(`Not a valid address: ${recipient}`);
    if (amount && typeof amount !== 'number') throw new Error(`Not a valid amount: ${amount}`);
    if (message && typeof message !== 'string') throw new Error(`Not a valid message: ${message}`);
    const optionsArray = [
        recipient.replace(/ /g, ''), // strip spaces
        amount || '',
        encodeURIComponent(message || ''),
    ];
    // don't encode empty options (if they are not followed by other non-empty options)
    while (optionsArray[optionsArray.length - 1] === '') optionsArray.pop();

    if (!basePath!.endsWith('/')) basePath = `${basePath}/`;

    return `${basePath}#_request/${optionsArray.join('/')}_`;
}

export function parseNimiqRequestLink(
    requestLink: string | URL,
    requiredBasePath?: string,
) {
    if (!(requestLink instanceof URL)) {
        try {
            if (!requestLink.includes('://')) {
                // Because we are only interested in the host and hash, the protocol doesn't matter
                requestLink = 'dummy://' + requestLink;
            }
            requestLink = new URL(requestLink);
        } catch(e) {
            return null;
        }
    }
    if (requiredBasePath && requestLink.host !== requiredBasePath) return null;

    // check whether it's a request link
    const requestRegex = /_request\/(([^/]+)(\/[^/]*){0,2})_/;
    const requestRegexMatch = requestLink.hash.match(requestRegex);
    if (!requestRegexMatch) return null;

    // parse options
    const optionsSubstr = requestRegexMatch[1];
    let [recipient, amount, message] = optionsSubstr.split('/');

    // check options
    recipient = recipient
        .replace(/[ +-]|%20/g, '') // strip spaces and dashes
        .replace(/(.)(?=(.{4})+$)/g, '$1 '); // reformat with spaces, forming blocks of 4 chars
    if (!ValidationUtils.isValidAddress(recipient)) return null; // recipient is required

    let parsedAmount;
    if (typeof amount !== 'undefined' && amount !== '') {
        parsedAmount = parseFloat(amount);
        if (Number.isNaN(parsedAmount)) return null;
    } else {
        parsedAmount = null;
    }

    let parsedMessage;
    if (typeof message !== 'undefined' && message !== '') {
        parsedMessage = decodeURIComponent(message) ;
    } else {
        parsedMessage = null;
    }
    return { recipient, amount: parsedAmount, message: parsedMessage };
}

// following BIP21
export function createBitcoinRequestLink(
    recipient: string,
    options: BitcoinRequestLinkOptions = {},
) {
    if (!recipient) throw new Error('Recipient is required');
    if (options.amount && (!Number.isFinite(options.amount) || options.amount < 0)) throw new TypeError('Invalid amount');
    if (options.fee && (!Number.isFinite(options.fee) || options.fee < 0)) throw new TypeError('Invalid fee');
    const query = new URLSearchParams();
    const validQueryKeys: ['amount', 'fee', 'label', 'message'] = ['amount', 'fee', 'label', 'message'];
    validQueryKeys.forEach((key) => {
        const option = options[key];
        if (!option) return;
        // formatted value in BTC without scientific number notation
        const btcPrecision = 8;
        const formattedValue = typeof option === 'number'
            ? option.toFixed(btcPrecision).replace(/\.?0*$/g, '')
            : option.toString();
        query.set(key, formattedValue);
    }, '');
    const queryString = query.toString() ? `?${query.toString()}` : ''; // also urlEncodes the values
    return `bitcoin:${recipient}${queryString}`
}

// subset of EIP681
export function createEthereumRequestLink(
    recipient: string, // ETH address or ENS name
    options: EthereumRequestLinkOptions = {},
) {
    if (!recipient) throw new Error('Recipient is required');
    const { amount: value, gasPrice, gasLimit, chainId } = options;
    if (value && (!Number.isFinite(value) || value < 0)) throw new TypeError('Invalid amount');
    if (gasPrice && (!Number.isFinite(gasPrice) || gasPrice < 0)) throw new TypeError('Invalid gasPrice');
    if (gasLimit && (!Number.isInteger(gasLimit) || gasLimit < 0)) throw new TypeError('Invalid gasLimit');
    const eip831Prefix = !recipient.startsWith('0x') ? 'pay-' : '';
    const chainIdString = chainId !== undefined ? `@${chainId}` : '';
    const query = new URLSearchParams();
    const queryOptions: { [key: string]: number | undefined } = { value, gasLimit, gasPrice };
    Object.keys(queryOptions).forEach((key) => {
        const option = queryOptions[key];
        if (!option) return;
        // formatted ETH values in Wei with manual scientific number notation
        const ethPrecision = 18;
        const formattedValue = key === 'amount' || key === 'gasPrice'
            ? option.toFixed(ethPrecision).replace(/\.?0*$/g, '') + `e${ethPrecision}`
            : option.toString();
        query.set(key, formattedValue);
    }, '');
    const queryString = query.toString() ? `?${query.toString()}` : ''; // also urlEncodes the values
    return `ethereum:${eip831Prefix}${recipient}${chainIdString}${queryString}`;
}
