// This API supports using CryptoCompare or CoinGecko as data providers. For both, the free API is used, in an unauthen-
// ticated fashion, i.e. without api keys. Rate limits are determined based on the user's IP. The current recommendation
// is to use CryptoCompare as provider because its rate limits are significantly more generous, and CoinGecko does not
// allow fetching historic rates past the last 365 days on the free API.
export enum Provider {
    CryptoCompare = 'CryptoCompare',
    CoinGecko = 'CoinGecko',
}

// Note that CryptoCompare and CoinGecko support many more but these are the ones that are currently of interest to us.
export enum CryptoCurrency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
    USDC = 'usdc',
}

// This enum has been generated from the generated lists CRYPTOCOMPARE_FIAT_CURRENCIES, COINGECKO_FIAT_CURRENCIES and
// BRIDGEABLE_FIAT_CURRENCIES defined below via the following script:
//
// const CRYPTOCOMPARE_FIAT_CURRENCIES = [ ...as defined below ];
// const COINGECKO_FIAT_CURRENCIES = [ ...as defined below ];
// const BRIDGEABLE_FIAT_CURRENCIES = [ ...as defined below ];
// const allFiatCurrencies = [...new Set([
//     ...CRYPTOCOMPARE_FIAT_CURRENCIES,
//     ...COINGECKO_FIAT_CURRENCIES,
//     ...BRIDGEABLE_FIAT_CURRENCIES,
// ])].sort();
// const currencyNameFormatter = new Intl.DisplayNames('en-US', { type: 'currency' });
// console.log(allFiatCurrencies.map((currency) => `${currency} = '${currency.toLowerCase()}', `
//     + `// ${currencyNameFormatter.of(currency)}`).join('\n'));
export enum FiatCurrency {
    AED = 'aed', // United Arab Emirates Dirham
    AFN = 'afn', // Afghan Afghani
    ALL = 'all', // Albanian Lek
    AMD = 'amd', // Armenian Dram
    ANG = 'ang', // Netherlands Antillean Guilder
    AOA = 'aoa', // Angolan Kwanza
    ARS = 'ars', // Argentine Peso
    AUD = 'aud', // Australian Dollar
    AWG = 'awg', // Aruban Florin
    AZN = 'azn', // Azerbaijani Manat
    BAM = 'bam', // Bosnia-Herzegovina Convertible Mark
    BBD = 'bbd', // Barbadian Dollar
    BDT = 'bdt', // Bangladeshi Taka
    BGN = 'bgn', // Bulgarian Lev
    BHD = 'bhd', // Bahraini Dinar
    BIF = 'bif', // Burundian Franc
    BMD = 'bmd', // Bermudan Dollar
    BND = 'bnd', // Brunei Dollar
    BOB = 'bob', // Bolivian Boliviano
    BRL = 'brl', // Brazilian Real
    BSD = 'bsd', // Bahamian Dollar
    BTN = 'btn', // Bhutanese Ngultrum
    BWP = 'bwp', // Botswanan Pula
    BYN = 'byn', // Belarusian Ruble
    BZD = 'bzd', // Belize Dollar
    CAD = 'cad', // Canadian Dollar
    CDF = 'cdf', // Congolese Franc
    CHF = 'chf', // Swiss Franc
    CLP = 'clp', // Chilean Peso
    CNY = 'cny', // Chinese Yuan
    COP = 'cop', // Colombian Peso
    CRC = 'crc', // Costa Rican Colón
    CUP = 'cup', // Cuban Peso
    CVE = 'cve', // Cape Verdean Escudo
    CZK = 'czk', // Czech Koruna
    DJF = 'djf', // Djiboutian Franc
    DKK = 'dkk', // Danish Krone
    DOP = 'dop', // Dominican Peso
    DZD = 'dzd', // Algerian Dinar
    EGP = 'egp', // Egyptian Pound
    ERN = 'ern', // Eritrean Nakfa
    ETB = 'etb', // Ethiopian Birr
    EUR = 'eur', // Euro
    FJD = 'fjd', // Fijian Dollar
    FKP = 'fkp', // Falkland Islands Pound
    GBP = 'gbp', // British Pound
    GEL = 'gel', // Georgian Lari
    GHS = 'ghs', // Ghanaian Cedi
    GIP = 'gip', // Gibraltar Pound
    GMD = 'gmd', // Gambian Dalasi
    GNF = 'gnf', // Guinean Franc
    GTQ = 'gtq', // Guatemalan Quetzal
    GYD = 'gyd', // Guyanaese Dollar
    HKD = 'hkd', // Hong Kong Dollar
    HNL = 'hnl', // Honduran Lempira
    HTG = 'htg', // Haitian Gourde
    HUF = 'huf', // Hungarian Forint
    IDR = 'idr', // Indonesian Rupiah
    ILS = 'ils', // Israeli New Shekel
    INR = 'inr', // Indian Rupee
    IQD = 'iqd', // Iraqi Dinar
    IRR = 'irr', // Iranian Rial
    ISK = 'isk', // Icelandic Króna
    JMD = 'jmd', // Jamaican Dollar
    JOD = 'jod', // Jordanian Dinar
    JPY = 'jpy', // Japanese Yen
    KES = 'kes', // Kenyan Shilling
    KGS = 'kgs', // Kyrgystani Som
    KHR = 'khr', // Cambodian Riel
    KMF = 'kmf', // Comorian Franc
    KPW = 'kpw', // North Korean Won
    KRW = 'krw', // South Korean Won
    KWD = 'kwd', // Kuwaiti Dinar
    KYD = 'kyd', // Cayman Islands Dollar
    KZT = 'kzt', // Kazakhstani Tenge
    LAK = 'lak', // Laotian Kip
    LBP = 'lbp', // Lebanese Pound
    LKR = 'lkr', // Sri Lankan Rupee
    LRD = 'lrd', // Liberian Dollar
    LSL = 'lsl', // Lesotho Loti
    LYD = 'lyd', // Libyan Dinar
    MAD = 'mad', // Moroccan Dirham
    MDL = 'mdl', // Moldovan Leu
    MGA = 'mga', // Malagasy Ariary
    MKD = 'mkd', // Macedonian Denar
    MMK = 'mmk', // Myanmar Kyat
    MNT = 'mnt', // Mongolian Tugrik
    MOP = 'mop', // Macanese Pataca
    MRU = 'mru', // Mauritanian Ouguiya
    MUR = 'mur', // Mauritian Rupee
    MVR = 'mvr', // Maldivian Rufiyaa
    MWK = 'mwk', // Malawian Kwacha
    MXN = 'mxn', // Mexican Peso
    MYR = 'myr', // Malaysian Ringgit
    MZN = 'mzn', // Mozambican Metical
    NAD = 'nad', // Namibian Dollar
    NGN = 'ngn', // Nigerian Naira
    NIO = 'nio', // Nicaraguan Córdoba
    NOK = 'nok', // Norwegian Krone
    NPR = 'npr', // Nepalese Rupee
    NZD = 'nzd', // New Zealand Dollar
    OMR = 'omr', // Omani Rial
    PAB = 'pab', // Panamanian Balboa
    PEN = 'pen', // Peruvian Sol
    PGK = 'pgk', // Papua New Guinean Kina
    PHP = 'php', // Philippine Peso
    PKR = 'pkr', // Pakistani Rupee
    PLN = 'pln', // Polish Zloty
    PYG = 'pyg', // Paraguayan Guarani
    QAR = 'qar', // Qatari Riyal
    RON = 'ron', // Romanian Leu
    RSD = 'rsd', // Serbian Dinar
    RUB = 'rub', // Russian Ruble
    RWF = 'rwf', // Rwandan Franc
    SAR = 'sar', // Saudi Riyal
    SBD = 'sbd', // Solomon Islands Dollar
    SCR = 'scr', // Seychellois Rupee
    SDG = 'sdg', // Sudanese Pound
    SEK = 'sek', // Swedish Krona
    SGD = 'sgd', // Singapore Dollar
    SHP = 'shp', // St. Helena Pound
    SOS = 'sos', // Somali Shilling
    SRD = 'srd', // Surinamese Dollar
    SSP = 'ssp', // South Sudanese Pound
    STN = 'stn', // São Tomé & Príncipe Dobra
    SYP = 'syp', // Syrian Pound
    SZL = 'szl', // Swazi Lilangeni
    THB = 'thb', // Thai Baht
    TJS = 'tjs', // Tajikistani Somoni
    TMT = 'tmt', // Turkmenistani Manat
    TND = 'tnd', // Tunisian Dinar
    TOP = 'top', // Tongan Paʻanga
    TRY = 'try', // Turkish Lira
    TTD = 'ttd', // Trinidad & Tobago Dollar
    TWD = 'twd', // New Taiwan Dollar
    TZS = 'tzs', // Tanzanian Shilling
    UAH = 'uah', // Ukrainian Hryvnia
    UGX = 'ugx', // Ugandan Shilling
    USD = 'usd', // US Dollar
    UYU = 'uyu', // Uruguayan Peso
    UZS = 'uzs', // Uzbekistani Som
    VES = 'ves', // Venezuelan Bolívar
    VND = 'vnd', // Vietnamese Dong
    VUV = 'vuv', // Vanuatu Vatu
    WST = 'wst', // Samoan Tala
    XAF = 'xaf', // Central African CFA Franc
    XCD = 'xcd', // East Caribbean Dollar
    XOF = 'xof', // West African CFA Franc
    XPF = 'xpf', // CFP Franc
    YER = 'yer', // Yemeni Rial
    ZAR = 'zar', // South African Rand
    ZMW = 'zmw', // Zambian Kwacha
}

export type ProviderFiatCurrency<P extends Provider> = P extends Provider.CryptoCompare
    ? CryptoCompareFiatCurrency
    : CoinGeckoFiatCurrency;

// Fiat currencies supported by CryptoCompare.
// This list has been generated by reducing the supported currencies to those that are listed as a circulating currency
// on https://en.wikipedia.org/wiki/List_of_circulating_currencies#List_of_circulating_currencies_by_state_or_territory
// via the following script:
//
// const referenceCurrencySymbols = { ...parsed from Wikipedia as described in CurrencyInfo.ts };
// const CryptoCurrency = { ...as defined above };
// const CRYPTOCOMPARE_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
//
// async function _fetch(url, init) {
//     const result = await fetch(url, init).then((response) => response.json());
//     if (result?.Message?.includes('rate limit')) {
//         console.log('Pausing on rate limit...');
//         await new Promise((resolve) => setTimeout(resolve, 3500));
//         return _fetch(url, init);
//     }
//     return result;
// }
//
// let knownFiatCurrencyEntries = [];
// let page = 1; // starts at 1
// let lastPage; // inclusive
// const pageSize = 100; // the max allowed page size
// do {
//     const { Data: {
//         LIST: entries,
//         STATS: { TOTAL_ASSETS: fiatCurrencyCount },
//     } } = await _fetch('https://data-api.cryptocompare.com/asset/v1/top/list'
//         + `?asset_type=FIAT&sort_by=CREATED_ON&sort_direction=ASC&page=${page}&page_size=${pageSize}`);
//     knownFiatCurrencyEntries = knownFiatCurrencyEntries.concat(entries);
//     lastPage = Math.ceil(fiatCurrencyCount / pageSize);
// } while (++page <= lastPage);
//
// const collator = new Intl.Collator('en');
// knownFiatCurrencyEntries.sort(({ SYMBOL: s1}, { SYMBOL: s2 }) => collator.compare(s1, s2));
//
// const supportedFiatCurrencyEntries = [];
// const fiatApiCryptoCurrencies = Object.keys(CryptoCurrency).join(',');
// for (const entry of knownFiatCurrencyEntries) {
//     const { SYMBOL: currency, NAME: name } = entry;
//     if (!(currency in referenceCurrencySymbols)) {
//         console.log(`Currency ${currency} (${name}) is skipped because it's not circulating.`);
//         continue;
//     }
//     const { Message: errorMessage } = await _fetch('https://min-api.cryptocompare.com/data/pricemulti'
//         + `?fsyms=${fiatApiCryptoCurrencies}&tsyms=${currency}&relaxedValidation=false`);
//     if (errorMessage?.includes('market does not exist')) {
//         console.log(`Currency ${currency} (${name}) is skipped because it's unsupported for our crypto currencies.`);
//         continue;
//     } else if (errorMessage) {
//         throw new Error(`Currency ${currency} (${name}) check failed because of unexpected error: ${errorMessage}`);
//     }
//     supportedFiatCurrencyEntries.push(entry);
// }
//
// console.log('Supported currencies:');
// console.log(supportedFiatCurrencyEntries.map(({ SYMBOL: currency }) => `'${currency}'`).join(', '));
// for (const currency of CRYPTOCOMPARE_FIAT_CURRENCIES) {
//     if (supportedFiatCurrencyEntries.some(({ SYMBOL }) => SYMBOL === currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore.`);
// }
const CRYPTOCOMPARE_FIAT_CURRENCIES = ([
    'AED', 'AOA', 'ARS', 'AUD', 'BGN', 'BND', 'BOB', 'BRL', 'BYN', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK', 'DKK',
    'ERN', 'EUR', 'GBP', 'GEL', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'KZT', 'MNT', 'MXN', 'MYR', 'NGN',
    'NOK', 'NZD', 'PEN', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'STN', 'THB', 'TRY', 'UAH', 'UGX', 'USD', 'VUV',
    'ZAR', 'ZMW',
] as const).map((ticker) => FiatCurrency[ticker]);
export type CryptoCompareFiatCurrency = (typeof CRYPTOCOMPARE_FIAT_CURRENCIES)[number];

// Fiat currencies supported by CoinGecko.
// Note that CoinGecko supports more vs_currencies (see https://api.coingecko.com/api/v3/simple/supported_vs_currencies)
// but also includes crypto currencies and ounces of gold amongst others that are not fiat currencies. This list here
// has been generated by reducing the vs_currencies to those that are listed as a circulating currency on
// https://en.wikipedia.org/wiki/List_of_circulating_currencies#List_of_circulating_currencies_by_state_or_territory
// via the following script:
//
// const referenceCurrencySymbols = { ...parsed from Wikipedia as described in CurrencyInfo.ts };
// const COINGECKO_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
//
// const coinGeckoCurrencies = (await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
//     .then((response) => response.json()))
//     .map((currency) => currency.toUpperCase())
//     .filter((currency) => currency in referenceCurrencySymbols)
//     .sort();
//
// console.log('Supported currencies:');
// console.log(coinGeckoCurrencies.map((currency) => `'${currency}'`).join(', '));
// for (const currency of COINGECKO_FIAT_CURRENCIES) {
//     if (coinGeckoCurrencies.includes(currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore`);
// }
const COINGECKO_FIAT_CURRENCIES = ([
    'AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BMD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'GEL',
    'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'KWD', 'LKR', 'MMK', 'MXN', 'MYR', 'NGN', 'NOK', 'NZD', 'PHP',
    'PKR', 'PLN', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VND', 'ZAR',
] as const).map((ticker) => FiatCurrency[ticker]);
export type CoinGeckoFiatCurrency = (typeof COINGECKO_FIAT_CURRENCIES)[number];

// Additionally supported fiat currencies, for which we calculate exchange rates by combining coin/USD and fiat/USD
// rates via the CPL API, if they're not directly supported by the chosen provider. These do not support historic rates.
// This list is designed to not overlap with HISTORY_BRIDGEABLE_FIAT_CURRENCIES, to prefer the history supporting APIs,
// and it has been generated by reducing the supported currencies to those that are listed as a circulating currency on
// https://en.wikipedia.org/wiki/List_of_circulating_currencies#List_of_circulating_currencies_by_state_or_territory via
// the following script:
//
// const referenceCurrencySymbols = { ...parsed from Wikipedia as described in CurrencyInfo.ts };
// const HISTORY_BRIDGEABLE_FIAT_CURRENCIES = [ ... as defined below (ticker strings only) ];
// const CPL_BRIDGEABLE_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
//
// const cplData = await fetch('https://firestore.googleapis.com/v1/projects/checkout-service/databases/(default)/'
//     + 'documents/exchangerates/rates').then((response) => response.json());
// const cplCurrencies = Object.keys(cplData.fields.rates.mapValue.fields)
//     .map((currency) => currency.toUpperCase())
//     .filter((currency) => currency in referenceCurrencySymbols
//         && !HISTORY_BRIDGEABLE_FIAT_CURRENCIES.includes(currency))
//     .sort();
//
// console.log('Supported currencies:');
// console.log(cplCurrencies.map((currency) => `'${currency}'`).join(', '));
// for (const currency of CPL_BRIDGEABLE_FIAT_CURRENCIES) {
//     if (cplCurrencies.includes(currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore`);
// }
const CPL_BRIDGEABLE_FIAT_CURRENCIES = ([
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF',
    'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CUP',
    'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP',
    'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD',
    'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD',
    'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN',
    'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB',
    'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS',
    'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST',
    'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW',
] as const).map((ticker) => FiatCurrency[ticker]);
export type CplBridgeableFiatCurrency = (typeof CPL_BRIDGEABLE_FIAT_CURRENCIES)[number];

// Additionally supported fiat currencies, for which we calculate exchange rates by combining coin/USD and fiat/USD
// rates, if they're not directly supported by the chosen provider. The currencies here support historic rates. This
// list is maintained manually.
const HISTORY_BRIDGEABLE_FIAT_CURRENCIES = (['CRC'] as const).map((ticker) => FiatCurrency[ticker] as const);
export type HistoryBridgeableFiatCurrency = (typeof HISTORY_BRIDGEABLE_FIAT_CURRENCIES)[number];

// Additionally supported fiat currencies, for which we calculate exchange rates by combining coin/USD and fiat/USD
// rates, if they're not directly supported by the chosen provider. Not all of these are supported for fetching
// historical exchange rates. Those that are, are listed in HISTORY_BRIDGEABLE_FIAT_CURRENCIES and all currencies that
// are supported for fetching historical exchange rates via a specific provider, bridged or not, can be checked for via
// isHistorySupportedFiatCurrency(currency, provider).
const BRIDGEABLE_FIAT_CURRENCIES = [
    ...CPL_BRIDGEABLE_FIAT_CURRENCIES,
    ...HISTORY_BRIDGEABLE_FIAT_CURRENCIES,
] as const;
export type BridgeableFiatCurrency = (typeof BRIDGEABLE_FIAT_CURRENCIES)[number];

// Check that no history-bridged currency is handled as cpl-bridged currency.
// If there is no overlap, the Extract should yield type never, which is a valid index for the empty object. However, if
// there is an overlap, the result of Extract will be non-empty, which is an invalid index for {}.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type __expectNoCplWithHistoryBridgeOverlap = {}[Extract<CplBridgeableFiatCurrency, HistoryBridgeableFiatCurrency>];

// Previously, when we supported CoinGecko as the only exchange rate provider, BridgeableFiatCurrency was designed such
// that it did not overlap with CoinGeckoFiatCurrency, i.e. overlapping entries were omitted in BridgeableFiatCurrency.
// With the introduction of CryptoCompare as an additional provider with a different set of supported currencies, we
// changed its definition to include all supported currencies, including those overlapping with currencies supported by
// either of the providers. Shall the API be reduced to only support one provider in the future, a check similar to the
// one below can be enabled again:
// Check that no currency supported directly by CoinGecko is handled as bridged currency. See description of
// __expectNoCplWithHistoryBridgeOverlap.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// type __expectNoCoinGeckoWithBridgedOverlap = {}[Extract<BridgeableFiatCurrency, CoinGeckoFiatCurrency>];

const HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES = {
    [FiatCurrency.CRC]: 'America/Costa_Rica',
} as const;
// Also checks no HistoryBridgeableFiatCurrency is missing in HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES
type HistoryBridgeableCurrencyTimezone = (typeof HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES)[HistoryBridgeableFiatCurrency];

const API_URL_CRYPTOCOMPARE = 'https://min-api.cryptocompare.com/data';
let API_URL_COINGECKO = 'https://api.coingecko.com/api/v3';

const COIN_IDS_COINGECKO = {
    [CryptoCurrency.NIM]: 'nimiq-2',
    [CryptoCurrency.BTC]: 'bitcoin',
    [CryptoCurrency.ETH]: 'ethereum',
    [CryptoCurrency.USDC]: 'usd-coin',
} as const;

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * @param url The URL to the CoinGecko v3 API.
 */
export function setCoinGeckoApiUrl(url = 'https://api.coingecko.com/api/v3') {
    API_URL_COINGECKO = url;
}

const coinGeckoExtraHeaders = new Map<string, string>();

export function setCoinGeckoApiExtraHeader(name: string, value: string | false) {
    if (value !== false) {
        coinGeckoExtraHeaders.set(name, value);
    } else {
        coinGeckoExtraHeaders.delete(name);
    }
}

export async function getExchangeRates<
    C extends CryptoCurrency,
    V extends ProviderFiatCurrency<P> | BridgeableFiatCurrency | CryptoCurrency,
    P extends Provider = Provider.CryptoCompare,
>(
    cryptoCurrencies: C[],
    vsCurrencies: V[],
    provider: P = Provider.CryptoCompare as P,
): Promise<Record<C, Record<V, number | undefined>>> {
    // Make sure the currencies are lower case to match the enums (for users that might not be using typescript which
    // ensures that only valid currency tickers are passed).
    cryptoCurrencies = cryptoCurrencies.map((currency) => currency.toLowerCase() as C);
    vsCurrencies = vsCurrencies.map((currency) => currency.toLowerCase() as V);
    // vsCurrencies handled by the provider. Potentially extended by USD.
    const providerVsCurrencies: Array<ProviderFiatCurrency<P> | CryptoCurrency> = [];
    const bridgedVsCurrencies: Array<Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P>>> = [];
    for (const currency of vsCurrencies) {
        if (isProviderSupportedFiatCurrency(currency, provider)) {
            providerVsCurrencies.push(currency);
        } else if (isBridgedFiatCurrency(currency, provider)) {
            bridgedVsCurrencies.push(currency);
        } else {
            throw new Error(`Currency ${currency} not supported for provider ${provider}.`);
        }
    }

    // Check for bridged currencies and fetch their USD exchange rates
    let bridgedExchangeRatesPromise: Promise<Partial<Record<
        Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P>>,
        number | undefined
    >>> | undefined;
    if (bridgedVsCurrencies.length) {
        bridgedExchangeRatesPromise = _getBridgeableFiatCurrencyExchangeRates(bridgedVsCurrencies);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate.
        if (!providerVsCurrencies.includes(FiatCurrency.USD)) {
            providerVsCurrencies.push(FiatCurrency.USD);
        }
    }

    let providerExchangeRatesPromise: Promise<Record<C, Record<V, number | undefined>>>;
    switch (provider) {
        case Provider.CryptoCompare:
            providerExchangeRatesPromise = _fetch<Record<string, Record<string, number>>>(
                `${API_URL_CRYPTOCOMPARE}/pricemulti`
                + `?fsyms=${cryptoCurrencies.join(',')}&tsyms=${providerVsCurrencies.join(',')}`,
            ).then((exchangeRates) => cryptoCurrencies.reduce((result, cryptoCurrency) => ({
                ...result,
                [cryptoCurrency]: providerVsCurrencies.reduce((coinPrices, vsCurrency) => ({
                    ...coinPrices,
                    // Tickers in CryptoCompare's result are uppercase. Map them back to our enums.
                    [vsCurrency]: exchangeRates[cryptoCurrency.toUpperCase()][vsCurrency.toUpperCase()],
                }), {} as Record<V, number | undefined>),
            }), {} as Record<C, Record<V, number | undefined>>));
            break;
        case Provider.CoinGecko: {
            // Note that providerVsCurrencies do not need to be converted to coin ids, even for crypto currencies.
            const coinIds = cryptoCurrencies.map((currency) => COIN_IDS_COINGECKO[currency]);
            providerExchangeRatesPromise = _fetch<Record<string, Record<string, number>>>(
                `${API_URL_COINGECKO}/simple/price`
                + `?ids=${coinIds.join(',')}&vs_currencies=${providerVsCurrencies.join(',')}`,
                // Run sequentially to avoid (re)trying many parallel requests waiting on CoinGecko's low rate limit.
                /* sequentially */ true,
            ).then((prices) => cryptoCurrencies.reduce((result, cryptoCurrency) => ({
                ...result,
                // Map CoinGecko coin ids back to CryptoCurrency enum.
                [cryptoCurrency]: prices[COIN_IDS_COINGECKO[cryptoCurrency]],
            }), {} as Record<C, Record<V, number | undefined>>));
            break;
        }
        default: throw new Error(`Unsupported provider ${provider}`);
    }

    const [
        exchangeRates,
        bridgedExchangeRates,
    ] = await Promise.all([providerExchangeRatesPromise, bridgedExchangeRatesPromise]);

    // Add prices calculated from bridged exchange rates, if any.
    for (const [bridgedCurrency, bridgedExchangeRate] of Object.entries<number|undefined>(bridgedExchangeRates || {})) {
        for (const coinPrices of Object.values<Record<V, number | undefined>>(exchangeRates)) {
            const coinUsdPrice = coinPrices[FiatCurrency.USD as V];
            coinPrices[bridgedCurrency as V] = bridgedExchangeRate && coinUsdPrice
                ? bridgedExchangeRate * coinUsdPrice
                : undefined;
        }
    }

    // Strictly speaking, USD would need to be filtered out if it was added, but we skip that for code simplicity.
    return exchangeRates;
}

/**
 * Request historic exchange rates by range. Input and output timestamps are in milliseconds.
 *
 * Additional noted for CryptoCompare:
 * We currently return data at hourly resolution. However, minutely or daily data would also be possible.
 *
 * Additional notes for CoinGecko:
 * The free, public API limits historic exchange rates to the past 365 days. Requesting older data results in 401 -
 * Unauthorized errors. The time resolution of returned data depends on the chosen range. CoinGecko provides minutely
 * for ranges within 1 day from the current time, hourly data for any ranges between 1 day and 90 days (do not need to
 * be within 90 days from current time) and daily for ranges above 90 days. Note that minutely data is ~5-10 minutes
 * apart, hourly data about an hour.
 */
export async function getHistoricExchangeRatesByRange<P extends Provider = Provider.CryptoCompare>(
    cryptoCurrency: CryptoCurrency,
    vsCurrency: ProviderFiatCurrency<P> | HistoryBridgeableFiatCurrency | CryptoCurrency,
    from: number, // in milliseconds
    to: number, // in milliseconds
    provider: P = Provider.CryptoCompare as P,
): Promise<Array<[/* time in ms */ number, /* price */ number]>> {
    let bridgedCurrency: Exclude<HistoryBridgeableFiatCurrency, ProviderFiatCurrency<P>> | undefined;
    let bridgedHistoricRatesPromise: Promise<{[date: string]: number | undefined}> | undefined;
    if (isBridgedFiatCurrency(vsCurrency, provider) && isHistorySupportedFiatCurrency(vsCurrency, provider)
        && !isProviderSupportedFiatCurrency(vsCurrency, provider)) {
        bridgedCurrency = vsCurrency;
        bridgedHistoricRatesPromise = _getHistoricBridgeableFiatCurrencyExchangeRatesByRange(bridgedCurrency, from, to);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate, too.
        vsCurrency = FiatCurrency.USD;
    }

    // from and to are expected in seconds.
    from = Math.floor(from / 1000);
    to = Math.ceil(to / 1000);

    let providerHistoricRatesPromise: Promise<Array<[number, number]>>;
    switch (provider) {
        case Provider.CryptoCompare:
            providerHistoricRatesPromise = (async () => {
                let result: Array<[number, number]> = [];
                let batchToTs = to; // last timestamp to include in current batch; inclusive
                while (batchToTs >= from) {
                    // eslint-disable-next-line no-await-in-loop
                    const { Data: { TimeFrom: batchFromTs, Data: batch } } = await _fetch<{
                        // Type reduced to the properties of interest to us.
                        Data: {
                            TimeFrom: number,
                            Data: Array<{
                                // Open time, as evident from the fact that an entry for the current hour is already
                                // available at the current time, and only open stays constant while low, high and close
                                // price can vary if fetched at various times in the current hour. In seconds.
                                time: number,
                                open: number,
                            }>
                        },
                    }>(
                        `${API_URL_CRYPTOCOMPARE}/v2/histohour`
                        + `?fsym=${cryptoCurrency}&tsym=${vsCurrency}&toTs=${batchToTs}&limit=2000`,
                    );
                    const filteredAndTransformedBatch: Array<[number, number]> = [];
                    for (const { time, open } of batch) {
                        if (time < from) continue;
                        filteredAndTransformedBatch.push([time * 1000, open]);
                    }
                    result = filteredAndTransformedBatch.concat(result);
                    batchToTs = batchFromTs - 1;
                }
                return result;
            })();
            break;
        case Provider.CoinGecko: {
            const coinId = COIN_IDS_COINGECKO[cryptoCurrency.toLowerCase() as CryptoCurrency];
            // Note that timestamps returned by CoinGecko are already in ms, even though from and to were in seconds.
            providerHistoricRatesPromise = _fetch<{ prices: Array<[number, number]> }>(
                `${API_URL_COINGECKO}/coins/${coinId}/market_chart/range`
                + `?vs_currency=${vsCurrency}&from=${from}&to=${to}`,
                // Run sequentially to avoid (re)trying many parallel requests waiting on CoinGecko's low rate limit.
                /* sequentially */ true,
            ).then(({ prices }) => prices);
            break;
        }
        default: throw new Error(`Unsupported provider ${provider}`);
    }

    const [
        providerHistoricRates,
        bridgedHistoricRates,
    ] = await Promise.all([
        providerHistoricRatesPromise,
        bridgedHistoricRatesPromise,
    ]);

    if (bridgedCurrency && bridgedHistoricRates) {
        // Convert exchange rates to bridged currency and omit entries for which no bridged exchange rate is available.
        return providerHistoricRates.map(([timestamp, coinUsdPrice]) => {
            const date = _getDateString(timestamp, HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES[bridgedCurrency!]);
            const bridgedHistoricRate = bridgedHistoricRates[date];
            return bridgedHistoricRate ? [timestamp, coinUsdPrice * bridgedHistoricRate] : null;
        }).filter((entry): entry is [number, number] => entry !== null);
    }

    return providerHistoricRates;
}

/**
 * Get historic exchange rates at specific timestamps in milliseconds.
 */
export async function getHistoricExchangeRates<P extends Provider = Provider.CryptoCompare>(
    cryptoCurrency: CryptoCurrency,
    vsCurrency: ProviderFiatCurrency<P> | HistoryBridgeableFiatCurrency | CryptoCurrency,
    timestamps: number[],
    provider: P = Provider.CryptoCompare as P,
    disableMinutelyData: P extends Provider.CoinGecko ? boolean : never = false as typeof disableMinutelyData,
): Promise<Map<number, number|undefined>> {
    const result = new Map<number, number|undefined>();
    if (!timestamps.length) return result;
    timestamps.sort((a, b) => a - b);

    let prices: Array<[number, number]>;
    switch (provider) {
        case Provider.CryptoCompare:
            prices = await getHistoricExchangeRatesByRange(
                cryptoCurrency,
                vsCurrency,
                // Prices are exactly 1h apart, choose from&to such we get earlier&later data point for interpolation.
                timestamps[0] - ONE_HOUR,
                timestamps[timestamps.length - 1] + ONE_HOUR,
                provider,
            );
            break;
        case Provider.CoinGecko: {
            // To get the best possible time resolution, we split the timestamps into a chunk within at most 1 day from
            // now and the rest into additional 90 day chunks, see notes on getHistoricExchangeRatesByRange.
            const now = Date.now();
            const chunks: Array<{ start: number, end: number }> = [];
            let timestampIndex = timestamps.length - 1;

            // Create one day chunk
            if (!disableMinutelyData && now - timestamps[timestamps.length - 1] < ONE_DAY - 15 * ONE_MINUTE) {
                // Has a timestamp within last day (minus safety margin in case our clock is slightly off).
                // As one day is calculated from now and not from the timestamp, we have to account for the difference
                // between now and the timestamp.
                const maxChunkLength = ONE_DAY - 15 * ONE_MINUTE - (now - timestamps[timestamps.length - 1]);
                const { chunk, searchEndIndex } = _findCoinGeckoTimestampChunk(
                    timestamps,
                    timestampIndex,
                    maxChunkLength,
                    // Prices are 5-10 min apart, choose margin such we get earlier&later data point for interpolation.
                    10 * ONE_MINUTE,
                );
                chunks.push(chunk);
                timestampIndex = searchEndIndex;
            }

            // Create additional 90 day chunks
            while (timestampIndex >= 0) {
                const { chunk, searchEndIndex } = _findCoinGeckoTimestampChunk(
                    timestamps,
                    timestampIndex,
                    90 * ONE_DAY,
                    // Prices are ~1h apart, chose margin such we get earlier and later data point for interpolation.
                    1.5 * ONE_HOUR,
                );
                chunks.push(chunk);
                timestampIndex = searchEndIndex;
            }

            const fetchPromises = chunks.map(
                ({ start, end }) => getHistoricExchangeRatesByRange(cryptoCurrency, vsCurrency, start, end, provider),
            );
            prices = (await Promise.all(fetchPromises)).reduce(
                (accumulated, singleResult) => [...singleResult, ...accumulated],
                [] as Array<[number, number]>,
            ).sort((a, b) => a[0] - b[0]); // have to re-sort by timestamp as chunks might be overlapping
            break;
        }
        default: throw new Error(`Unsupported provider ${provider}`);
    }

    if (!prices.length) return result; // Happens if provider doesn't have data for any of the requested timestamps,
    // for example for days before the provider started collecting price info or for days in the future.

    // For every requested timestamp interpolate the price from the timestamps we got from the API
    let timestampIndex = 0;
    let priceIndex = 0;
    while (timestampIndex < timestamps.length) {
        // Search priceIndex at which predecessor price timestamp < our timestamp <= current price timestamp.
        const timestamp = timestamps[timestampIndex];
        while (priceIndex < prices.length && prices[priceIndex][0] < timestamp) {
            ++priceIndex;
        }
        if (priceIndex === 0 || priceIndex === prices.length) {
            // Can't interpolate. This should typically not happen as we try to include additional data points for
            // interpolation via an added time margin in our calls to getHistoricExchangeRatesByRange. However, this can
            // still occur in exceptional cases when the gap between two data points was larger than our margin or the
            // requested timestamp was before the provider even started recording price data or is in the future.
            const priceEntry = prices[Math.min(priceIndex, prices.length - 1)];
            if (Math.abs(timestamp - priceEntry[0]) < 2 * ONE_DAY && timestamp <= Date.now()) {
                // Accept the single price entry's price if it's within a limit of 2 days and we're not making
                // assumptions about the future.
                result.set(timestamp, priceEntry[1]);
            }
        } else {
            // Interpolate between priceIndex-1 and priceIndex
            const predecessorEntry = prices[priceIndex - 1];
            const currentEntry = prices[priceIndex];
            const timeDelta = currentEntry[0] - predecessorEntry[0];
            if (timeDelta < 2 * ONE_DAY) {
                // accept the interpolation if timeDelta is within 2 days (typically should be 1 hour).
                const priceDelta = currentEntry[1] - predecessorEntry[1];
                const interpolatedPrice = predecessorEntry[1]
                    + priceDelta * ((timestamp - predecessorEntry[0]) / timeDelta);
                result.set(timestamp, interpolatedPrice);
            }
        }
        ++timestampIndex; // Continue with next timestamp and check same priceIndex
    }
    return result;
}

function _findCoinGeckoTimestampChunk(
    timestamps: number[],
    searchStartIndex: number,
    maxChunkLength: number,
    timeMargin: number,
) {
    maxChunkLength -= 2 * timeMargin;
    const end = timestamps[searchStartIndex];
    let start = end;
    let i = searchStartIndex - 1;
    while (i >= 0 && end - timestamps[i] < maxChunkLength) {
        start = timestamps[i];
        --i;
    }
    return {
        searchEndIndex: i,
        chunk: {
            start: start - timeMargin,
            end: end + timeMargin,
        },
    };
}

let _fetchLock = Promise.resolve(); // note: shared across _fetch calls, i.e. not specific to an api or bridge
async function _fetch<T>(input: RequestInfo, init?: RequestInit, sequentially?: boolean): Promise<T>;
async function _fetch<T>(input: RequestInfo, sequentially?: boolean): Promise<T>;
async function _fetch<T>(
    input: RequestInfo,
    initOrSequentially?: RequestInit | boolean,
    sequentially: boolean = false,
): Promise<T> {
    const init = typeof initOrSequentially !== 'boolean' ? initOrSequentially : undefined;
    sequentially = typeof initOrSequentially === 'boolean' ? initOrSequentially : sequentially;

    let unlock: (() => void) | undefined;
    if (sequentially) {
        const previousLock = _fetchLock;
        _fetchLock = new Promise<void>((resolve) => { unlock = resolve; });
        await previousLock;
    }

    try {
        let result: any = null;
        do {
            let retry = true;
            let waitTime = 20000; // default wait time when user is offline
            try {
                // eslint-disable-next-line no-await-in-loop
                const response = await fetch(input, { // Throws when user is offline, in which case we retry.
                    ...init,
                    headers: [
                        ...(init instanceof Headers || Array.isArray(init) ? init : Object.entries(init || {})),
                        ...coinGeckoExtraHeaders,
                    ],
                });
                if (response.status === 429) {
                    // CoinGecko returns responses with status 429 (Too Many Requests) when the rate limit is hit.
                    // CoinGecko allows a dynamic amount of requests per minute, typically around 5 requests per minute,
                    // and tells us in the response headers when our next minute starts, but unfortunately due to cors
                    // we can not access this information. Therefore, we blindly retry after waiting some time. Note
                    // that CoinGecko resets the quota solely based on their system time, i.e. independent of when we
                    // resend our request. Therefore, we do not waste time/part of our quota by waiting a bit longer.
                    waitTime = 15000;
                    throw new Error('Rate limit hit. Retrying...');
                }
                if (!response.ok) {
                    // On other error codes, do not retry, e.g. on status 401 (Unauthorized) for api calls that require
                    // an API key like CoinGecko requests of historic data older than 365 days.
                    retry = false;
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                // eslint-disable-next-line no-await-in-loop
                result = await response.json();
                if (result?.Response === 'Error' && result?.Message?.includes('rate limit')) {
                    // CryptoCompare returns responses with status 200 but an error result when the rate limit is hit.
                    // CryptoCompare allows for 20 requests per second, and up to 300 requests per minute, see stats on
                    // /stats/rate/limit. I.e. we could burst 20 requests every 4 seconds to reach 300 requests per min.
                    // We use a slightly shorter waitTime than that, to reduce the chances of wasting any of the limit,
                    // for requests that we initiate in sequential chunks instead of in parallel bursts, like history
                    // requests. We could optimize this, as the response includes more detailed info about which rate
                    // limit was hit, but it's probably not really necessary.
                    waitTime = 3000;
                    throw new Error(`Rate limit hit: ${result.Message || result.Response}. Retrying...`);
                }
                if (result?.Response === 'Error') {
                    // On other CryptoCompare errors, do not retry, e.g. for api calls that require an API key.
                    retry = false;
                    throw new Error(`CryptoCompare error: ${result.Message || result.Response}`);
                }
            } catch (e) {
                if (!retry) throw e;
                // User might be offline, or we ran into the provider's rate limiting.
                // Note that we do not prioritize between our fetches, therefore they will be resolved in random order.
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => { setTimeout(resolve, waitTime); });
            }
        } while (!result);
        return result;
    } finally {
        unlock?.();
    }
}

export function isProviderSupportedFiatCurrency<P extends Provider>(currency: unknown, provider: P)
: currency is ProviderFiatCurrency<P> {
    const providerFiatCurrencies = {
        [Provider.CryptoCompare]: CRYPTOCOMPARE_FIAT_CURRENCIES,
        [Provider.CoinGecko]: COINGECKO_FIAT_CURRENCIES,
    }[provider];
    return providerFiatCurrencies.includes(currency as any);
}

export function isBridgeableFiatCurrency(currency: unknown): currency is BridgeableFiatCurrency {
    return BRIDGEABLE_FIAT_CURRENCIES.includes(currency as any);
}

export function isBridgedFiatCurrency<P extends Provider>(currency: unknown, provider: P)
: currency is Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P>> {
    return isBridgeableFiatCurrency(currency) && !isProviderSupportedFiatCurrency(currency, provider);
}

export function isHistorySupportedFiatCurrency<P extends Provider>(currency: unknown, provider: P)
: currency is ProviderFiatCurrency<P> | HistoryBridgeableFiatCurrency {
    return isProviderSupportedFiatCurrency(currency, provider)
        || HISTORY_BRIDGEABLE_FIAT_CURRENCIES.includes(currency as any);
}

/**
 * Get today's exchange rates to USD. Rates can be undefined if the user's clock is in the future.
 */
async function _getBridgeableFiatCurrencyExchangeRates<B extends BridgeableFiatCurrency>(bridgeableFiatCurrencies: B[])
: Promise<Record<B, number | undefined>> {
    const apiPromises: Array<Promise<Partial<Record<B, number | undefined>>>> = [];

    // Note that history-bridgeable currencies and cpl-bridgeable currencies don't overlap by design.

    const historyBridgeableFiatCurrencies = HISTORY_BRIDGEABLE_FIAT_CURRENCIES
        .filter((c) => bridgeableFiatCurrencies.includes(c as B));
    if (historyBridgeableFiatCurrencies.length) {
        for (const currency of historyBridgeableFiatCurrencies) {
            apiPromises.push(_getHistoricBridgeableFiatCurrencyExchangeRatesByRange(currency, Date.now())
                .then((exchangeRates): Partial<Record<BridgeableFiatCurrency, number | undefined>> => ({
                    // There is only a single entry in exchangeRates, if any, which is for the current date.
                    [currency]: Object.values(exchangeRates)[0],
                })));
        }
    }

    const cplBridgeableFiatCurrencies = CPL_BRIDGEABLE_FIAT_CURRENCIES
        .filter((c) => bridgeableFiatCurrencies.includes(c as B));
    if (cplBridgeableFiatCurrencies.length) {
        apiPromises.push(_fetch<FirebaseRawResponse>(
            'https://firestore.googleapis.com/v1/projects/checkout-service/databases/(default)/documents/'
                + 'exchangerates/rates',
        ).then((exchangeRatesResponse) => {
            const exchangeRates = _parseCplExchangeRateResponse(exchangeRatesResponse);
            // Reduce to only the requested cplBridgeableFiatCurrencies.
            return cplBridgeableFiatCurrencies.reduce((result, currency) => ({
                ...result,
                [currency]: exchangeRates[currency],
            }), {});
        }));
    }

    const apiResults = await Promise.all(apiPromises);
    return apiResults.reduce((exchangeRates, apiResult) => ({
        ...exchangeRates,
        ...apiResult,
    }));
}

/**
 * Get historic exchange rates to USD.
 */
async function _getHistoricBridgeableFiatCurrencyExchangeRatesByRange(
    bridgeableFiatCurrency: HistoryBridgeableFiatCurrency,
    from: number, // in milliseconds, inclusive
    to: number = from, // in milliseconds, inclusive
): Promise<{[date: string]: number | undefined}> {
    if (!HISTORY_BRIDGEABLE_FIAT_CURRENCIES.includes(bridgeableFiatCurrency)) {
        // Currently only supported for CRC. Check for users that don't use typescript.
        throw new Error(`Unsupported bridgeable currency for historic rates: ${bridgeableFiatCurrency}`);
    }
    const timezone = HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES[bridgeableFiatCurrency];
    const fromDate = _getDateString(from, timezone);
    const toDate = to === from ? fromDate : _getDateString(to, timezone);
    // Note: entries for future dates are omitted and thus basically undefined which is reflected in the return type.
    return _fetch<{[date: string]: number}>(`https://usd-crc-historic-rate.deno.dev/api/rates/${fromDate}/${toDate}`);
}

/**
 * Format a timestamp as a YYYY-MM-DD date string in a desired timezone.
 */
function _getDateString(timestamp: number | Date, timezone: HistoryBridgeableCurrencyTimezone): string {
    // Define as record such that ts warns us if an entry is missing
    const timezoneUtcOffsets: Record<HistoryBridgeableCurrencyTimezone, number> = {
        'America/Costa_Rica': -6, // fixed offset all year, as Costa Rica has no daylight saving time.
    };
    const timezoneUtcOffset = timezoneUtcOffsets[timezone];
    if (timezoneUtcOffset === undefined) {
        // Arbitrary timezones could be supported via DateTimeFormat.formatToParts, but manually shifting the date is
        // computationally slightly cheaper.
        throw new Error(`Unsupported timezone ${timezone}`);
    }

    // Shift timestamp such that its UTC date equates the date in timezone.
    const shiftedDate = new Date(timestamp);
    shiftedDate.setHours(shiftedDate.getHours() + timezoneUtcOffset); // supports under-/overflow into prev/next day
    return shiftedDate.toISOString().split('T')[0];
}

type FirebaseRawPrimitive = {
    doubleValue: number,
} | {
    integerValue: string,
} | {
    stringValue: string,
} | {
    booleanValue: boolean,
} | {
    nullValue: null,
};
type FirebaseRawValue = FirebaseRawPrimitive | {
    mapValue: {
        fields: Record<string, FirebaseRawPrimitive>,
    },
} | {
    arrayValue: {
        values: FirebaseRawPrimitive[],
    },
};
type FirebaseRawResponse = {
    name: string,
    fields: Record<string, FirebaseRawValue>,
    createTime: string,
    updateTime: string,
};

type FirebasePrimitive = number | string | boolean | null;
type FirebaseValue = FirebasePrimitive | Record<string, FirebasePrimitive> | FirebasePrimitive[];
type FirebaseResponse = Record<string, FirebaseValue>;

function _parseCplExchangeRateResponse(response: FirebaseRawResponse): Record<string, number> {
    const parsed = _parseRawFirebaseResponse(response);
    if (!('rates' in parsed)) throw new Error('Invalid FirebaseResponse');

    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed.rates as Record<string, FirebasePrimitive>)) {
        if (typeof value !== 'number') throw new Error('Invalid FirebaseResponse');
        result[key.toLowerCase()] = value;
    }
    return result;
}

function _parseRawFirebaseResponse(response: FirebaseRawResponse): FirebaseResponse {
    const result: FirebaseResponse = {};
    for (const [key, value] of Object.entries(response.fields)) {
        result[key] = _parseRawFirebaseValue(value);
    }
    return result;
}

function _parseRawFirebaseValue(raw: FirebaseRawValue): FirebaseValue {
    if ('mapValue' in raw) {
        const result: Record<string, FirebasePrimitive> = {};
        for (const [key, value] of Object.entries(raw.mapValue.fields)) {
            result[key] = _parseRawFirebasePrimitive(value);
        }
        return result;
    }
    if ('arrayValue' in raw) {
        return raw.arrayValue.values.map((value) => _parseRawFirebasePrimitive(value));
    }
    return _parseRawFirebasePrimitive(raw);
}

function _parseRawFirebasePrimitive(raw: FirebaseRawPrimitive): FirebasePrimitive {
    if ('doubleValue' in raw) {
        return raw.doubleValue;
    }
    if ('integerValue' in raw) {
        return parseInt(raw.integerValue, 10);
    }
    if ('stringValue' in raw) {
        return raw.stringValue;
    }
    if ('booleanValue' in raw) {
        return raw.booleanValue;
    }
    if ('nullValue' in raw) {
        return null;
    }
    throw new Error('Invalid FirebaseRawPrimitive');
}
