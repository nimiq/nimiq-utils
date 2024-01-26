import { ValidationUtils } from './ValidationUtils.js';
import { FormattableNumber, toNonScientificNumberString } from './FormattableNumber.js';

var Currency;
(function (Currency) {
    Currency["NIM"] = "nim";
    Currency["BTC"] = "btc";
    Currency["ETH"] = "eth";
    Currency["MATIC"] = "matic";
    Currency["USDC"] = "usdc";
})(Currency || (Currency = {}));
const DECIMALS = {
    [Currency.NIM]: 5,
    [Currency.BTC]: 8,
    [Currency.ETH]: 18,
    [Currency.MATIC]: 18,
    [Currency.USDC]: 6,
};
// Uses chain ids as values.
var EthereumChain;
(function (EthereumChain) {
    EthereumChain[EthereumChain["ETHEREUM_MAINNET"] = 1] = "ETHEREUM_MAINNET";
    EthereumChain[EthereumChain["ETHEREUM_GOERLI_TESTNET"] = 5] = "ETHEREUM_GOERLI_TESTNET";
    EthereumChain[EthereumChain["POLYGON_MAINNET"] = 137] = "POLYGON_MAINNET";
    EthereumChain[EthereumChain["POLYGON_MUMBAI_TESTNET"] = 80001] = "POLYGON_MUMBAI_TESTNET";
})(EthereumChain || (EthereumChain = {}));
var EthereumBlockchainName;
(function (EthereumBlockchainName) {
    EthereumBlockchainName["ETHEREUM"] = "ethereum";
    EthereumBlockchainName["POLYGON"] = "polygon";
})(EthereumBlockchainName || (EthereumBlockchainName = {}));
const ETHEREUM_SUPPORTED_NATIVE_CURRENCIES = [Currency.ETH, Currency.MATIC];
const ETHEREUM_SUPPORTED_CONTRACTS = {
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
};
const ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP = {};
for (const [chainId, chainContracts] of Object.entries(ETHEREUM_SUPPORTED_CONTRACTS)) {
    for (const [currency, address] of Object.entries(chainContracts)) {
        ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP[address] = [
            parseInt(chainId, 10),
            currency,
        ];
    }
}
// for parsing the path part of an eip681 link: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-681.md#syntax
const ETHEREUM_PATH_REGEX = new RegExp('^'
    + '(?:pay-)?' // optional "pay-" suffix of the schema prefix
    + '([^@/?]+)' // mandatory target address
    + '(?:@([^/?]+))?' // optional chain id
    + '(?:/([^?]+))?' // optional function name
    + '$');
var NimiqRequestLinkType;
(function (NimiqRequestLinkType) {
    NimiqRequestLinkType["SAFE"] = "safe";
    NimiqRequestLinkType["URI"] = "nimiq";
    NimiqRequestLinkType["WEBURI"] = "web+nim";
})(NimiqRequestLinkType || (NimiqRequestLinkType = {}));
// Can be used with an options object or with the legacy function signature for creating a Nim request link.
// If using the legacy function signature, amountOrOptions can be given as a value in Nim.
function createRequestLink(recipient, amountOrOptions, // amount in Nim or options object
message, basePath = window.location.host) {
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
function parseRequestLink(requestLink, options = {}) {
    const currencies = options.currencies || Object.values(Currency);
    const isValidAddress = options.isValidAddress || {};
    const normalizeAddress = options.normalizeAddress || {};
    const { expectedNimiqSafeRequestLinkBasePath } = options;
    const url = toUrl(requestLink);
    if (!url)
        return null;
    const addCurrencyToResult = (parsedRequestLink, currency) => (parsedRequestLink ? { ...parsedRequestLink, currency } : null);
    if (currencies.includes(Currency.NIM) && /^(web\+)?nim(iq)?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqUriRequestLink(url), Currency.NIM);
    }
    if (currencies.includes(Currency.NIM) && /^https?:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseNimiqSafeRequestLink(url, expectedNimiqSafeRequestLinkBasePath), Currency.NIM);
    }
    if (currencies.includes(Currency.BTC) && /^bitcoin:$/i.test(url.protocol)) {
        return addCurrencyToResult(parseBitcoinRequestLink(url, isValidAddress[Currency.BTC], normalizeAddress[Currency.BTC]), Currency.BTC);
    }
    if ([...ETHEREUM_SUPPORTED_NATIVE_CURRENCIES, Currency.USDC].some((currency) => currencies.includes(currency))
        && new RegExp(`^(${Object.values(EthereumBlockchainName).join('|')}):$`, 'i').test(url.protocol)) {
        const parsedRequestLink = parseEthereumRequestLink(url, isValidAddress[Currency.ETH], normalizeAddress[Currency.ETH]);
        if (parsedRequestLink && currencies.includes(parsedRequestLink.currency)) {
            return parsedRequestLink;
        }
    }
    return null;
}
function createNimiqRequestLink(recipient, options = { basePath: window.location.host }) {
    const { amount, message, label, basePath, type = NimiqRequestLinkType.SAFE } = options;
    if (!ValidationUtils.isValidAddress(recipient))
        throw new Error(`Not a valid address: ${recipient}`);
    if (amount && !isUnsignedSafeInteger(amount))
        throw new Error(`Not a valid amount: ${amount}`);
    if (message && typeof message !== 'string')
        throw new Error(`Not a valid message: ${message}`);
    if (label && typeof label !== 'string')
        throw new Error(`Not a valid label: ${label}`);
    recipient = ValidationUtils.normalizeAddress(recipient).replace(/ /g, ''); // normalize and strip spaces
    const amountNim = amount
        ? new FormattableNumber(amount).moveDecimalSeparator(-DECIMALS[Currency.NIM]).toString()
        : '';
    // Assemble params
    const query = [['recipient', recipient]];
    if (amountNim || message || label)
        query.push(['amount', amountNim || '']);
    if (message || label)
        query.push(['message', encodeURIComponent(message || '')]);
    if (label)
        query.push(['label', encodeURIComponent(label)]);
    // Create Safe-style `https://` links
    // Note that the encoding scheme for Safe-style links is the same as
    // for Safe XRouter aside route parameters (see _makeAside).
    if (type === NimiqRequestLinkType.SAFE) {
        const params = query.map((param) => param[1]);
        return `${basePath}${!basePath.endsWith('/') ? '/' : ''}#_request/${params.join('/')}_`;
    }
    // Create URI scheme `nimiq:` links
    if (type === NimiqRequestLinkType.URI || type === NimiqRequestLinkType.WEBURI) {
        const address = query.shift()[1];
        const params = query.map(([key, value]) => (value ? `${key}=${value}` : '')).filter((param) => !!param);
        return `${type}:${address}${params.length ? '?' : ''}${params.join('&')}`;
    }
    throw new Error(`Unknown type: ${type}`);
}
function parseNimiqSafeRequestLink(requestLink, expectedBasePath) {
    const url = toUrl(requestLink);
    if (!url || (expectedBasePath && url.host !== expectedBasePath))
        return null;
    // check whether it's a request link
    const requestRegex = /_request\/(([^/]+)(\/[^/]*){0,2})_/;
    const requestRegexMatch = url.hash.match(requestRegex);
    if (!requestRegexMatch)
        return null;
    // parse options
    const optionsSubstr = requestRegexMatch[1];
    const [recipient, amount, message] = optionsSubstr.split('/')
        .map((part) => (part ? decodeURIComponent(part) : part));
    return parseNimiqParams({ recipient, amount, message });
}
function parseNimiqUriRequestLink(requestLink) {
    const url = toUrl(requestLink);
    if (!url || !/^(web\+)?nim(iq)?:$/i.test(url.protocol))
        return null;
    // Fetch options
    const recipient = url.pathname;
    const amount = url.searchParams.get('amount') || undefined;
    const label = url.searchParams.get('label') || undefined;
    const message = url.searchParams.get('message') || undefined;
    return parseNimiqParams({ recipient, amount, label, message });
}
function parseNimiqParams(params) {
    const recipient = ValidationUtils.normalizeAddress(params.recipient);
    if (!ValidationUtils.isValidAddress(recipient))
        return null; // recipient is required
    const amount = params.amount ? Math.round(parseFloat(params.amount) * (10 ** DECIMALS[Currency.NIM])) : undefined;
    if (typeof amount === 'number' && !isUnsignedSafeInteger(amount))
        return null;
    const { label, message } = params;
    return { recipient, amount, label, message };
}
// following BIP21
function createBitcoinRequestLink(recipient, // expected to be normalized
options = {}) {
    if (!recipient)
        throw new Error('Recipient is required');
    if (options.amount && !isUnsignedSafeInteger(options.amount))
        throw new TypeError('Invalid amount');
    if (options.fee && !isUnsignedSafeInteger(options.fee))
        throw new TypeError('Invalid fee');
    const query = [];
    const validQueryKeys = ['amount', 'fee', 'label', 'message'];
    validQueryKeys.forEach((key) => {
        const option = options[key];
        if (!option)
            return;
        // formatted value in BTC without scientific number notation
        const formattedValue = key === 'amount' || key === 'fee'
            ? new FormattableNumber(option).moveDecimalSeparator(-DECIMALS[Currency.BTC]).toString()
            : encodeURIComponent(option.toString());
        query.push(`${key}=${formattedValue}`);
    }, '');
    const queryString = query.length ? `?${query.join('&')}` : '';
    return `bitcoin:${recipient}${queryString}`;
}
function parseBitcoinRequestLink(requestLink, isValidAddress, normalizeAddress) {
    const url = toUrl(requestLink);
    if (!url || !/^bitcoin:$/i.test(url.protocol))
        return null;
    const recipient = normalizeAddress ? normalizeAddress(url.pathname) : url.pathname;
    const rawAmount = url.searchParams.get('amount');
    const rawFee = url.searchParams.get('fee');
    const label = url.searchParams.get('label') || undefined;
    const message = url.searchParams.get('message') || undefined;
    if (!recipient || (isValidAddress && !isValidAddress(recipient)))
        return null; // recipient is required
    const amount = rawAmount ? Math.round(parseFloat(rawAmount) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof amount === 'number' && !isUnsignedSafeInteger(amount))
        return null;
    const fee = rawFee ? Math.round(parseFloat(rawFee) * (10 ** DECIMALS[Currency.BTC])) : undefined;
    if (typeof fee === 'number' && !isUnsignedSafeInteger(fee))
        return null;
    return { recipient, amount, fee, label, message };
}
// Following eip681. ETH, Matic and USDC (both on Ethereum and Polygon) are directly supported. For other currencies, a
// custom contract address can be manually specified. However, the only supported smart contract function is /transfer.
// Deviating from the standard, we use polygon: instead of ethereum: as protocol for requests on the Polygon chain which
// is what many other wallets and exchanges do, too.
function createEthereumRequestLink(recipient, // addresses only; no support for ENS names; expected to be normalized
currency, options) {
    const { amount, gasPrice, gasLimit, chainId } = options;
    const contractAddress = options.contractAddress
        || (chainId ? getEthereumContractAddress(chainId, currency) : undefined);
    if (!recipient || !validateEthereumAddress(recipient)) {
        throw new TypeError(`Invalid recipient address: ${recipient}.`);
    }
    if (amount && !isUnsignedSafeInteger(amount))
        throw new TypeError('Invalid amount');
    if (gasPrice && !isUnsignedSafeInteger(gasPrice))
        throw new TypeError('Invalid gasPrice');
    if (gasLimit && !isUnsignedSafeInteger(gasLimit))
        throw new TypeError('Invalid gasLimit');
    if (chainId && !isUnsignedSafeInteger(chainId))
        throw new TypeError('Invalid chainId');
    if (contractAddress && !validateEthereumAddress(contractAddress)) {
        throw new TypeError(`Invalid contract address: ${contractAddress}.`);
    }
    const [contractChainId] = (contractAddress ? getEthereumContractInfo(contractAddress) : null)
        || [];
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
    let targetAddress;
    if (contractAddress) {
        // For determining the target address, the contractAddress has priority, even if the requested currency is a
        // native currency, as the user might have provided a custom contractAddress, and the native currency just to
        // determine the protocol.
        targetAddress = contractAddress;
    }
    else if (isNativeEthereumCurrency(currency)) {
        targetAddress = recipient;
    }
    else {
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
function parseEthereumRequestLink(requestLink, isValidAddress = validateEthereumAddress, normalizeAddress = (address) => address) {
    const url = toUrl(requestLink);
    if (!url
        || !new RegExp(`^(${Object.values(EthereumBlockchainName).join('|')}):$`, 'i').test(url.protocol))
        return null;
    const [, targetAddress, rawChainId, rawFunctionName] = url.pathname.match(ETHEREUM_PATH_REGEX) || [];
    if (!targetAddress || !isValidAddress(normalizeAddress(targetAddress)))
        return null; // target address is required
    // Note that we limit support of contract request links to contracts specified in ETHEREUM_SUPPORTED_CONTRACTS
    const contractInfo = getEthereumContractInfo(targetAddress);
    const [contractChainId, contractCurrency] = contractInfo || [];
    const isContract = !!contractInfo;
    const contractAddress = isContract ? normalizeAddress(targetAddress) : undefined;
    const chainId = rawChainId ? parseInt(rawChainId, 10) : (contractChainId
        // Guess the chain from the protocol. If the protocol is 'ethereum:' don't assume the ethereum chain though,
        // because it's a valid protocol for other chains too, according to the standard.
        || (url.protocol === `${EthereumBlockchainName.POLYGON}:` ? EthereumChain.POLYGON_MAINNET : undefined));
    if (typeof chainId === 'number' && (!isUnsignedSafeInteger(chainId)
        || !Object.values(EthereumChain).includes(chainId)
        // While technically the contract id is a valid address, regular or for another contract, on other chain ids,
        // it is highly unlikely that it's actually the user's intention to receive funds there.
        || (typeof contractChainId === 'number' && chainId !== contractChainId)))
        return null;
    const currency = contractCurrency
        || (chainId ? getEthereumCurrency(chainId) : undefined)
        // Fallback to the protocol, which was checked to contain a valid EthereumBlockchainName in the beginning.
        || getEthereumCurrency(url.protocol.match(/[^:]+/)[0].toLowerCase());
    const functionName = rawFunctionName ? decodeURIComponent(rawFunctionName) : undefined;
    if ((!!functionName !== isContract) || (functionName && functionName !== 'transfer')) {
        // A functionName needs to be specified for contracts, and a supported contract needs to be detected if a
        // functionName is set. Additionally, the only supported contract function is transfer.
        return null;
    }
    const contractRecipient = url.searchParams.get('address')
        ? normalizeAddress(url.searchParams.get('address'))
        : undefined;
    const rawAmount = url.searchParams.get(isContract ? 'uint256' : 'value');
    const rawGasPrice = url.searchParams.get('gasPrice');
    const rawGasLimit = url.searchParams.get('gasLimit');
    if ((!!contractRecipient !== isContract) || (contractRecipient && !isValidAddress(contractRecipient)))
        return null;
    const recipient = contractRecipient || normalizeAddress(targetAddress);
    let amount;
    let gasPrice;
    let gasLimit;
    try {
        amount = rawAmount ? parseUnsignedInteger(rawAmount) : undefined;
        gasPrice = rawGasPrice ? parseUnsignedInteger(rawGasPrice) : undefined;
        const parsedGasLimit = rawGasLimit ? parseUnsignedInteger(rawGasLimit) : undefined;
        if (typeof parsedGasLimit === 'bigint')
            return null;
        gasLimit = parsedGasLimit;
    }
    catch (e) {
        return null;
    }
    return { currency, recipient, amount, gasPrice, gasLimit, chainId, contractAddress };
}
function toUrl(link) {
    if (link instanceof URL)
        return link;
    if (!link.includes(':')) {
        // If the link does not include a protocol, include a protocol to be parseable as URL. We assume https by
        // default, but it could be any dummy protocol. The // after the : can be omitted. If a request link format
        // requires a specific protocol, it is checked by the parsing method itself.
        link = `https:${link}`;
    }
    try {
        return new URL(link);
    }
    catch (e) {
        return null;
    }
}
function isUnsignedSafeInteger(value) {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) && value >= 0;
    }
    if (typeof value === 'bigint') {
        return value >= 0;
    }
    return !value.isNegative();
}
function parseUnsignedInteger(value) {
    value = toNonScientificNumberString(value); // Resolves scientific notation and throws for invalid number strings.
    let result = parseFloat(value); // Parse to a number first, for browsers without bigint support.
    if (result < 0)
        throw new Error('Value is negative');
    if (!Number.isSafeInteger(result)) {
        // Non-integer, non-safe integer larger than Number.MAX_SAFE_INTEGER or NaN (which it can't really be as
        // toNonScientificNumberString parses only valid numbers). Try parsing again as bigint, which supports integers
        // above Number.MAX_SAFE_INTEGER, and throws for actual invalid or non-integer numbers.
        result = BigInt(value);
    }
    return result;
}
function isNativeEthereumCurrency(currency) {
    return ETHEREUM_SUPPORTED_NATIVE_CURRENCIES.includes(currency);
}
function validateEthereumAddress(address) {
    return /^0x[a-f0-9]{40}$/i.test(address);
}
function getEthereumBlockchainName(chainIdOrNativeCurrency) {
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
function getEthereumCurrency(chainIdOrBlockchainName) {
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
function getEthereumContractAddress(chainId, currency) {
    if (isNativeEthereumCurrency(currency))
        return null;
    const contracts = ETHEREUM_SUPPORTED_CONTRACTS[chainId];
    if (!contracts) {
        throw new Error(`Unsupported chainId: ${chainId}. You need to specify the 'contractAddress' option.`);
    }
    const contractAddress = contracts[currency];
    if (!contractAddress) {
        throw new Error(`Unsupported contract: ${currency} on chain ${chainId}. `
            + 'You need to specify the \'contractAddress\' option.');
    }
    return contractAddress;
}
// Return the chainId and currency for known contract address.
function getEthereumContractInfo(contractAddress) {
    return ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP[contractAddress.toLowerCase()] || null;
}

export { Currency, ETHEREUM_SUPPORTED_CONTRACTS, ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP, ETHEREUM_SUPPORTED_NATIVE_CURRENCIES, EthereumChain, NimiqRequestLinkType, createBitcoinRequestLink, createEthereumRequestLink, createNimiqRequestLink, createRequestLink, parseBitcoinRequestLink, parseEthereumRequestLink, parseNimiqSafeRequestLink, parseNimiqUriRequestLink, parseRequestLink };
//# sourceMappingURL=RequestLinkEncoding.js.map
