import { RateLimitScheduler } from '../rate-limit-scheduler/RateLimitScheduler';

// This API supports using CryptoCompare (legacy min-api and newer data-api endpoints) or CoinGecko as data providers.
// For both, the free API is used, in an unauthenticated fashion, i.e. without api keys. Rate limits are determined
// based on the user's IP.
// The current recommendation is to use CryptoCompare as provider because its rate limits are significantly more
// generous, and CoinGecko does not allow fetching historic rates past the last 365 days on the free API.
// CryptoCompare's min-api is deprecated (see https://developers.ccdata.io/documentation/data-api/introduction), but
// using it in conjunction with CryptoCompare's newer data-api endpoint can still make sense, as usages for both are
// tracked separately, effectively doubling the allowance / rate limit.
export enum Provider {
    CryptoCompare = 'CryptoCompare',
    CryptoCompareLegacy = 'CryptoCompareLegacy',
    CoinGecko = 'CoinGecko',
}

export enum RateType {
    CURRENT = 'current',
    HISTORIC = 'historic',
}

// Note that CryptoCompare and CoinGecko support many more but these are the ones that are currently of interest to us.
export enum CryptoCurrency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
    USDC = 'usdc',
    USDT = 'usdt',
}

// This enum has been generated from CRYPTOCOMPARE_FIAT_CURRENCIES, CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES,
// CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES, COINGECKO_FIAT_CURRENCIES and BRIDGEABLE_FIAT_CURRENCIES defined
// below via the following script:
//
// const CRYPTOCOMPARE_FIAT_CURRENCIES = [ ...as defined below ];
// const CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES = [ ...as defined below ];
// const CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES = [ ...as defined below ];
// const COINGECKO_FIAT_CURRENCIES = [ ...as defined below ];
// const BRIDGEABLE_FIAT_CURRENCIES = [ ...as defined below ];
// const allFiatCurrencies = [...new Set([
//     ...CRYPTOCOMPARE_FIAT_CURRENCIES,
//     ...CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES,
//     ...CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES,
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
    ZWL = 'zwl', // Zimbabwean Dollar (2009)
}

export type ProviderFiatCurrency<P extends Provider, T extends RateType> = P extends Provider.CryptoCompare
    ? CryptoCompareFiatCurrency
    : P extends Provider.CryptoCompareLegacy
        ? CryptoCompareLegacyFiatCurrency<T>
        : CoinGeckoFiatCurrency;

// Fiat currencies supported by CryptoCompare.
// For the new API, we're using the new default index, CADLI (https://ccdata.io/indices/cadli), while for the Legacy API
// we're using the previous default, CCCAGG (now called CCIX, https://ccdata.io/indices/ccix). CADLI supports more
// currencies by automatically converting from USD.
// This list has been generated by reducing the supported currencies to those that are listed as a circulating currency
// on https://en.wikipedia.org/wiki/List_of_circulating_currencies#List_of_circulating_currencies_by_state_or_territory
// via the following script:
//
// const referenceCurrencySymbols = { ...parsed from Wikipedia as described in CurrencyInfo.ts };
// const CryptoCurrency = { ...as defined above };
// const CRYPTOCOMPARE_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
// const CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
// const CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
//
// async function _fetch(url, init) {
//     const result = await fetch(url, init).then((response) => response.json());
//     if (/rate limit/i.test(/* new data-api */ result?.Err?.message || /* legacy min-api */ result?.Message)) {
//         console.log('Pausing on rate limit...');
//         await new Promise((resolve) => setTimeout(resolve, 3500));
//         return _fetch(url, init);
//     }
//     return result;
// }
//
// async function _isSupportedCurrency(currency, forHistoricRates, forLegacyApi) {
//     let errorMessage;
//     if (forLegacyApi) {
//         const fiatApiCryptoCurrencies = Object.keys(CryptoCurrency).join(',');
//         // For historic rates use CCCAGG exchange / data set, the default used by CryptoCompare for historic rates.
//         const exchangeParameter = forHistoricRates ? '&e=CCCAGG' : '';
//         ({ Message: errorMessage } = await _fetch(
//             'https://min-api.cryptocompare.com/data/pricemulti'
//             + `?fsyms=${fiatApiCryptoCurrencies}&tsyms=${currency}${exchangeParameter}&relaxedValidation=false`,
//         ));
//         if (errorMessage?.includes('market does not exist')) return false;
//     } else if (forHistoricRates) {
//         const instrument = `NIM-${currency.toUpperCase()}`;
//         ({ Err: { message: errorMessage } } = await _fetch(
//             'https://data-api.cryptocompare.com/index/cc/v1/historical/hours'
//             + `?market=cadli&instrument=${instrument}&apply_mapping=false&limit=1`,
//         ));
//         if (errorMessage?.includes('instrument parameter')) return false;
//     } else {
//         const instruments = Object.keys(CryptoCurrency)
//             .map((cryptoCurrency) => `${cryptoCurrency}-${currency.toUpperCase()}`)
//             .join(',');
//         ({ Err: { message: errorMessage } } = await _fetch(
//             'https://data-api.cryptocompare.com/index/cc/v1/latest/tick'
//             + `?market=cadli&instruments=${instruments}&apply_mapping=false`,
//         ));
//         if (errorMessage?.includes('instruments parameter')) return false;
//     }
//     if (errorMessage) throw new Error(`Currency ${currency} check failed with unexpected error: ${errorMessage}`);
//     return true;
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
// knownFiatCurrencyEntries.sort(({ SYMBOL: s1 }, { SYMBOL: s2 }) => collator.compare(s1, s2));
//
// const supportedCurrentRatesFiatCurrencyEntries = [];
// const supportedHistoricRatesFiatCurrencyEntries = [];
// const legacySupportedCurrentRatesFiatCurrencyEntries = [];
// const legacySupportedHistoricRatesFiatCurrencyEntries = [];
// for (const entry of knownFiatCurrencyEntries) {
//     const { SYMBOL: currency, NAME: name } = entry;
//     if (!(currency in referenceCurrencySymbols)) {
//         console.log(`Currency ${currency} (${name}) is skipped because it's not circulating.`);
//         continue;
//     }
//     if (await _isSupportedCurrency(currency, /* forHistoricRates */ false, /* forLegacyApi */ false)) {
//         supportedCurrentRatesFiatCurrencyEntries.push(entry);
//     }
//     if (await _isSupportedCurrency(currency, /* forHistoricRates */ true, /* forLegacyApi */ false)) {
//         supportedHistoricRatesFiatCurrencyEntries.push(entry);
//     }
//     if (await _isSupportedCurrency(currency, /* forHistoricRates */ false, /* forLegacyApi */ true)) {
//         legacySupportedCurrentRatesFiatCurrencyEntries.push(entry);
//     }
//     if (await _isSupportedCurrency(currency, /* forHistoricRates */ true, /* forLegacyApi */ true)) {
//         legacySupportedHistoricRatesFiatCurrencyEntries.push(entry);
//     }
// }
//
// // For the new CryptoCompare API, supported currencies for current rates and historic rates were the same for CADLI,
// // when the lists were initially created. Check that that's still the case.
// for (let i = 0; i < Math.max(
//     supportedCurrentRatesFiatCurrencyEntries.length,
//     supportedHistoricRatesFiatCurrencyEntries.length,
// ); ++i) {
//     const supportedCurrentRatesFiatCurrency = supportedCurrentRatesFiatCurrencyEntries[i]?.SYMBOL;
//     const supportedHistoricRatesFiatCurrency = supportedHistoricRatesFiatCurrencyEntries[i]?.SYMBOL;
//     if (supportedCurrentRatesFiatCurrency === supportedHistoricRatesFiatCurrency) continue;
//     throw new Error('List of supported currencies for new CryptoCompare API is not the same anymore for current and '
//         + `historic rates. Deviation at index ${i}: current rates currency is ${supportedCurrentRatesFiatCurrency}, `
//         + `historic rates currency is ${supportedHistoricRatesFiatCurrency}. The FiatApi must be adapted to `
//         + 'maintain two separate lists.');
// }
// const supportedCurrentAndHistoricRatesFiatCurrencyEntries = supportedCurrentRatesFiatCurrencyEntries;
//
// console.log('CryptoCompare supported currencies (same for current and historic rates):');
// console.log(supportedCurrentAndHistoricRatesFiatCurrencyEntries
//     .map(({ SYMBOL: currency }) => `'${currency}'`).join(', '));
// for (const currency of CRYPTOCOMPARE_FIAT_CURRENCIES) {
//     if (supportedCurrentAndHistoricRatesFiatCurrencyEntries.some(({ SYMBOL }) => SYMBOL === currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore.`);
// }
// console.log('CryptoCompare Legacy supported currencies for current rates:');
// console.log(legacySupportedCurrentRatesFiatCurrencyEntries
//     .map(({ SYMBOL: currency }) => `'${currency}'`).join(', '));
// for (const currency of CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES) {
//     if (legacySupportedCurrentRatesFiatCurrencyEntries.some(({ SYMBOL }) => SYMBOL === currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore.`);
// }
// console.log('CryptoCompare Legacy supported currencies for historic rates:');
// console.log(legacySupportedHistoricRatesFiatCurrencyEntries
//     .map(({ SYMBOL: currency }) => `'${currency}'`).join(', '));
// for (const currency of CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES) {
//     if (legacySupportedHistoricRatesFiatCurrencyEntries.some(({ SYMBOL }) => SYMBOL === currency)) continue;
//     console.warn(`Previously supported ${currency} is not supported or circulating anymore.`);
// }
const CRYPTOCOMPARE_FIAT_CURRENCIES = ([
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF',
    'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC',
    'CUP', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP',
    'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD',
    'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD',
    'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN',
    'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB',
    'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS',
    'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'VES', 'VND', 'VUV', 'WST', 'XAF',
    'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
] as const).map((ticker) => FiatCurrency[ticker]);
const CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES = ([
    'AED', 'AOA', 'ARS', 'AUD', 'BGN', 'BND', 'BOB', 'BRL', 'BYN', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CZK', 'DKK',
    'ERN', 'EUR', 'GBP', 'GEL', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'KZT', 'MNT', 'MXN', 'MYR',
    'NGN', 'NOK', 'NZD', 'PEN', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'STN', 'THB', 'TRY', 'TWD', 'UAH', 'UGX',
    'USD', 'VES', 'VUV', 'ZAR', 'ZMW',
] as const).map((ticker) => FiatCurrency[ticker]);
const CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES = ([
    'AED', 'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'COP', 'CZK', 'EUR', 'GBP', 'GEL', 'IDR', 'ILS', 'INR', 'JPY', 'KRW',
    'KZT', 'MXN', 'MYR', 'NGN', 'NZD', 'PLN', 'RON', 'RUB', 'SGD', 'THB', 'TRY', 'UAH', 'USD', 'ZAR',
] as const).map((ticker) => FiatCurrency[ticker]);
export type CryptoCompareFiatCurrency = (typeof CRYPTOCOMPARE_FIAT_CURRENCIES)[number];
export type CryptoCompareLegacyFiatCurrency<T extends RateType> = T extends RateType.CURRENT
    ? (typeof CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES)[number]
    : (typeof CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES)[number];

// Fiat currencies supported by CoinGecko, all of which support historic rates.
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
// const CPL_BRIDGEABLE_FIAT_CURRENCIES = [ ...as defined below (ticker strings only) ];
// const HISTORY_BRIDGEABLE_FIAT_CURRENCIES = [ ... as defined below (ticker strings only) ];
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
    'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD',
    'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY',
    'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD',
    'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO',
    'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF',
    'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT',
    'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD',
    'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
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

// Can also use ccdata.io as alternative endpoint. However, usages of cryptocompare.com and ccdata.io endpoints are
// tracked together, such that the rate limit can not be effectively increased by simply switching the endpoint.
// const API_URL_CRYPTOCOMPARE = 'https://data-api.ccdata.io/index/cc';
const API_URL_CRYPTOCOMPARE = 'https://data-api.cryptocompare.com/index/cc';
const API_URL_CRYPTOCOMPARE_LEGACY = 'https://min-api.cryptocompare.com/data';
let API_URL_COINGECKO = 'https://api.coingecko.com/api/v3';

const COIN_IDS_COINGECKO = {
    [CryptoCurrency.NIM]: 'nimiq-2',
    [CryptoCurrency.BTC]: 'bitcoin',
    [CryptoCurrency.ETH]: 'ethereum',
    [CryptoCurrency.USDC]: 'usd-coin',
    [CryptoCurrency.USDT]: 'tether',
} as const;

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * @param url The URL to the CoinGecko v3 API.
 */
export function setCoinGeckoApiUrl(url = 'https://api.coingecko.com/api/v3') {
    API_URL_COINGECKO = url;
}

const _coinGeckoExtraHeaders = new Map<string, string>();

export function setCoinGeckoApiExtraHeader(name: string, value: string | false) {
    if (value !== false) {
        _coinGeckoExtraHeaders.set(name, value);
    } else {
        _coinGeckoExtraHeaders.delete(name);
    }
}

export async function getExchangeRates<
    C extends CryptoCurrency,
    V extends ProviderFiatCurrency<P, RateType.CURRENT> | BridgeableFiatCurrency | CryptoCurrency,
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
    const providerVsCurrencies: Array<ProviderFiatCurrency<P, RateType.CURRENT> | CryptoCurrency> = [];
    const bridgedVsCurrencies: Array<Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P, RateType.CURRENT>>> = [];
    for (const currency of vsCurrencies) {
        if (isProviderSupportedFiatCurrency(currency, provider, RateType.CURRENT)) {
            providerVsCurrencies.push(currency);
        } else if (isBridgedFiatCurrency(currency, provider, RateType.CURRENT)) {
            bridgedVsCurrencies.push(currency);
        } else {
            throw new Error(`Currency ${currency} not supported for provider ${provider}.`);
        }
    }

    // Check for bridged currencies and fetch their USD exchange rates
    let bridgedExchangeRatesPromise: Promise<Partial<Record<
        Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P, RateType.CURRENT>>,
        number | undefined
    >>> | undefined;
    if (bridgedVsCurrencies.length) {
        bridgedExchangeRatesPromise = _getBridgeableFiatCurrencyExchangeRates(bridgedVsCurrencies);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate.
        const usd = FiatCurrency.USD; // as extra variable for type guard
        if (!isProviderSupportedFiatCurrency(usd, provider, RateType.CURRENT)) {
            throw new Error(`${provider} can not bridge via USD`);
        }
        if (!providerVsCurrencies.includes(usd)) {
            providerVsCurrencies.push(usd);
        }
    }

    let providerExchangeRatesPromise: Promise<Record<C, Record<V, number | undefined>>>;
    switch (provider) {
        case Provider.CryptoCompare:
            // Documentation: developers.cryptocompare.com/documentation/data-api/index_cc_v1_latest_tick
            providerExchangeRatesPromise = (async () => {
                const instruments = cryptoCurrencies.flatMap(
                    (cryptoCurrency) => vsCurrencies.map(
                        (vsCurrency) => `${cryptoCurrency.toUpperCase()}-${vsCurrency.toUpperCase()}`,
                    ),
                );
                // The max allowed number of instruments is 50. If requesting more, we need multiple requests.
                const maxBatchSize = 50;
                const batchPromises: Array<Promise<Record</* instrument */ string, { VALUE: number }>>> = [];
                for (let batchStart = 0; batchStart < instruments.length; batchStart += maxBatchSize) {
                    const batchInstruments = instruments.slice(
                        batchStart,
                        Math.min(instruments.length, batchStart + maxBatchSize),
                    );
                    batchPromises.push(_fetch<{ Data: Record</* instrument */ string, { VALUE: number }> }>(
                        `${API_URL_CRYPTOCOMPARE}/v1/latest/tick`
                        + `?market=cadli&instruments=${batchInstruments.join(',')}&groups=VALUE&apply_mapping=false`,
                        provider,
                    ).then(({ Data: data }) => data));
                }
                const result = {} as Record<C, Record<V, number | undefined>>;
                for (const batch of await Promise.all(batchPromises)) {
                    // The API response indexes data by instrument (trading pair) in uppercase. Map them back to our
                    // enums and merge everything.
                    for (const [instrument, { VALUE: exchangeRate }] of Object.entries(batch)) {
                        const [cryptoCurrency, vsCurrency] = instrument.split('-')
                            .map((ticker) => ticker.toLowerCase()) as [C, V];
                        result[cryptoCurrency] ||= {} as Record<V, number | undefined>;
                        result[cryptoCurrency][vsCurrency] = exchangeRate;
                    }
                }
                return result;
            })();
            break;
        case Provider.CryptoCompareLegacy:
            // Documentation: developers.cryptocompare.com/documentation/legacy/Price/multipleSymbolsPriceEndpoint
            providerExchangeRatesPromise = (async () => {
                // The max allowed length of the tsyms parameter is 100 chars, which equates to 25 comma separated
                // ticker symbols. If requesting more providerVsCurrencies, we need multiple requests.
                const maxBatchSize = 25;
                const batchPromises: Array<Promise<Record<string, Record<string, number>>>> = [];
                for (let batchStart = 0; batchStart < providerVsCurrencies.length; batchStart += maxBatchSize) {
                    const batchVsCurrencies = providerVsCurrencies.slice(
                        batchStart,
                        Math.min(providerVsCurrencies.length, batchStart + maxBatchSize),
                    );
                    batchPromises.push(_fetch<Record<string, Record<string, number>>>(
                        `${API_URL_CRYPTOCOMPARE_LEGACY}/pricemulti`
                        + `?fsyms=${cryptoCurrencies.join(',')}&tsyms=${batchVsCurrencies.join(',')}`,
                        provider,
                    ));
                }
                const result = {} as Record<C, Record<V, number | undefined>>;
                for (const batch of await Promise.all(batchPromises)) {
                    // Tickers in the API response are uppercase. Map them back to our enums and merge everything.
                    for (const [cryptoCurrencyTicker, coinPrices] of Object.entries(batch)) {
                        const cryptoCurrency = cryptoCurrencyTicker.toLowerCase() as C;
                        for (const [vsCurrencyTicker, exchangeRate] of Object.entries(coinPrices)) {
                            const vsCurrency = vsCurrencyTicker.toLowerCase() as V;
                            result[cryptoCurrency] ||= {} as Record<V, number | undefined>;
                            result[cryptoCurrency][vsCurrency] = exchangeRate;
                        }
                    }
                }
                return result;
            })();
            break;
        case Provider.CoinGecko: {
            // Documentation: docs.coingecko.com/v3.0.1/reference/simple-price
            // Note that providerVsCurrencies do not need to be converted to coin ids, even for crypto currencies.
            const coinIds = cryptoCurrencies.map((currency) => COIN_IDS_COINGECKO[currency]);
            providerExchangeRatesPromise = _fetch<Record<string, Record<string, number>>>(
                `${API_URL_COINGECKO}/simple/price`
                + `?ids=${coinIds.join(',')}&vs_currencies=${providerVsCurrencies.join(',')}`,
                provider,
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
 * Additional notes for CryptoCompare:
 * We currently return data at hourly resolution. However, minutely or daily data would also be possible, support for
 * which should then be added via an options object in the function signature, if needed.
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
    vsCurrency: ProviderFiatCurrency<P, RateType.HISTORIC> | HistoryBridgeableFiatCurrency | CryptoCurrency,
    from: number, // in milliseconds
    to: number, // in milliseconds
    provider: P = Provider.CryptoCompare as P,
): Promise<Array<[/* time in ms */ number, /* price */ number]>> {
    const requestedVsCurrency = vsCurrency;
    let bridgedCurrency: Exclude<HistoryBridgeableFiatCurrency, ProviderFiatCurrency<P, RateType.HISTORIC>> | undefined;
    let bridgedHistoricRatesPromise: Promise<{[date: string]: number | undefined}> | undefined;
    if (isBridgedFiatCurrency(vsCurrency, provider, RateType.HISTORIC)
        && !isProviderSupportedFiatCurrency(vsCurrency, provider, RateType.HISTORIC)) {
        bridgedCurrency = vsCurrency;
        bridgedHistoricRatesPromise = _getHistoricBridgeableFiatCurrencyExchangeRatesByRange(bridgedCurrency, from, to);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate, too.
        const usd = FiatCurrency.USD; // as extra variable for type guard
        if (!isProviderSupportedFiatCurrency(usd, provider, RateType.HISTORIC)) {
            throw new Error(`${provider} can not bridge via USD`);
        }
        vsCurrency = usd;
    }

    // from and to are expected in seconds.
    from = Math.floor(from / 1000);
    to = Math.ceil(to / 1000);
    let missingTo = 0; // will be set if the history between from and missingTo was not available

    let providerHistoricRatesPromise: Promise<Array<[number, number]>>;
    switch (provider) {
        case Provider.CryptoCompare:
            // Documentation: developers.cryptocompare.com/documentation/data-api/index_cc_v1_historical_hours
            providerHistoricRatesPromise = (async () => {
                let result: Array<[number, number]> = [];
                const instrument = `${cryptoCurrency.toUpperCase()}-${vsCurrency.toUpperCase()}`;
                let batchToTs = to; // last timestamp to include in current batch; inclusive
                try {
                    while (batchToTs >= from) {
                        const limit = Math.min(
                            2000, // maximum number of entries allowed to request per batch
                            Math.ceil(((batchToTs - from) * 1000) / ONE_HOUR) + 1,
                        );
                        // eslint-disable-next-line no-await-in-loop
                        const { Data: batch } = await _fetch<{
                            // Type reduced to the properties of interest to us.
                            Data: Array<{
                                TIMESTAMP: number, // open time in seconds, see response schema documentation
                                OPEN: number,
                            }>,
                        }>(
                            `${API_URL_CRYPTOCOMPARE}/v1/historical/hours`
                            + '?market=cadli&groups=OHLC&fill=false&apply_mapping=false'
                            + `&instrument=${instrument}&to_ts=${batchToTs}&limit=${limit}`,
                            provider,
                        );
                        const filteredAndTransformedBatch: Array<[number, number]> = [];
                        for (const { TIMESTAMP: timestamp, OPEN: open } of batch) {
                            if (timestamp < from) continue;
                            filteredAndTransformedBatch.push([timestamp * 1000, open]);
                        }
                        result = filteredAndTransformedBatch.concat(result);
                        // Entries seem to be sorted by timestamp, although not specifically mentioned in documentation.
                        batchToTs = batch[0].TIMESTAMP - 1;
                    }
                } catch (e) {
                    if (e instanceof Error
                        && e.message.includes('was not trading')
                        && typeof (e.cause as any)?.other_info?.first === 'number') {
                        // The time range requested by the user includes time before the first timestamp available on
                        // CADLI for the requested instrument. We will need to use a fallback to fill in the missing
                        // time range, if possible. Note that any entries including and after missingTo were returned
                        // and collected successfully. Only as soon as to_ts itself is before missingTo, CryptoCompare
                        // rejects the request with this error, which are then the entries missing.
                        missingTo = Math.min((e.cause as any).other_info.first - (result.length ? 1 : 0), to);
                    } else {
                        // Rethrow other errors
                        throw e;
                    }
                }
                return result;
            })();
            break;
        case Provider.CryptoCompareLegacy:
            // Documentation: developers.cryptocompare.com/documentation/legacy/Historical/dataHistohour
            if (cryptoCurrency === CryptoCurrency.NIM && vsCurrency === FiatCurrency.USD) {
                // The results of the deprecated legacy CryptoCompare API seem to be broken for NIM / have low accuracy,
                // if values are internally bridged from NIM/BTC rates, as the used rates seem to be based on full, non-
                // fractional satoshi. Therefore, use NIM/USDT instead of NIM/USD, to provide better values at least for
                // that pair.
                vsCurrency = CryptoCurrency.USDT;
            }
            providerHistoricRatesPromise = (async () => {
                let result: Array<[number, number]> = [];
                let batchToTs = to; // last timestamp to include in current batch; inclusive
                while (batchToTs >= from) {
                    const limit = Math.min(
                        2000, // maximum number of entries allowed to request per batch
                        Math.ceil(((batchToTs - from) * 1000) / ONE_HOUR) + 1,
                    ) - 1; // Legacy returns one entry more than requested. Adjust for consistent batch sizes to new API
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
                        `${API_URL_CRYPTOCOMPARE_LEGACY}/v2/histohour`
                        + `?fsym=${cryptoCurrency}&tsym=${vsCurrency}&toTs=${batchToTs}&limit=${limit}`,
                        provider,
                    );
                    const filteredAndTransformedBatch: Array<[number, number]> = [];
                    for (const { time: timestamp, open } of batch) {
                        if (timestamp < from) continue;
                        filteredAndTransformedBatch.push([timestamp * 1000, open]);
                    }
                    result = filteredAndTransformedBatch.concat(result);
                    // Note that for CryptoCompareLegacy, we do not have to implement handling for the first available
                    // history entry, as CryptoCompareLegacy propagates the first available price backwards to earlier
                    // times, e.g. propagates the first NIM-BTC price backwards and converts with the BTC price at the
                    // requested time for e.g. NIM-USD. We don't concern us here with whether this should be considered
                    // good practice.
                    batchToTs = batchFromTs - 1;
                }
                return result;
            })();
            break;
        case Provider.CoinGecko: {
            // Documentation: docs.coingecko.com/v3.0.1/reference/coins-id-market-chart-range
            const coinId = COIN_IDS_COINGECKO[cryptoCurrency.toLowerCase() as CryptoCurrency];
            // Note that timestamps returned by CoinGecko are already in ms, even though from and to were in seconds.
            // Also note that for CoinGecko, we're not implementing handling for the first available history entry, as
            // CoinGecko is only of limited use anyway as it only allows accessing the data of the last 365 days on the
            // public API.
            providerHistoricRatesPromise = _fetch<{ prices: Array<[number, number]> }>(
                `${API_URL_COINGECKO}/coins/${coinId}/market_chart/range`
                + `?vs_currency=${vsCurrency}&from=${from}&to=${to}`,
                provider,
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
    let result = providerHistoricRates;

    if (bridgedCurrency && bridgedHistoricRates) {
        // Convert exchange rates to bridged currency and omit entries for which no bridged exchange rate is available.
        result = providerHistoricRates.map(([timestamp, coinUsdPrice]) => {
            const date = _getDateString(timestamp, HISTORY_BRIDGEABLE_CURRENCY_TIMEZONES[bridgedCurrency!]);
            const bridgedHistoricRate = bridgedHistoricRates[date];
            return bridgedHistoricRate ? [timestamp, coinUsdPrice * bridgedHistoricRate] : null;
        }).filter((entry): entry is [number, number] => entry !== null);
    }

    if (missingTo && isHistorySupportedFiatCurrency(requestedVsCurrency, Provider.CryptoCompareLegacy)) {
        // Fill in missing time range via CryptoCompareLegacy as fallback, if possible, which provides exchange rates
        // for arbitrary dates in the past, see above. Using CryptoCompare (non-legacy) with CCIX instead isn't a viable
        // alternative, as it does not provide converted rates, e.g. NIM-JPY, only actually traded pairs like NIM-BTC.
        const fallbackEntries = await getHistoricExchangeRatesByRange(
            cryptoCurrency,
            requestedVsCurrency,
            from * 1000,
            missingTo * 1000,
            Provider.CryptoCompareLegacy,
        );
        result = fallbackEntries.concat(result);
    }

    return result;
}

/**
 * Get historic exchange rates at specific timestamps in milliseconds.
 */
export async function getHistoricExchangeRates<P extends Provider = Provider.CryptoCompare>(
    cryptoCurrency: CryptoCurrency,
    vsCurrency: ProviderFiatCurrency<P, RateType.HISTORIC> | HistoryBridgeableFiatCurrency | CryptoCurrency,
    timestamps: number[],
    provider: P = Provider.CryptoCompare as P,
    options: P extends Provider.CoinGecko ? { disableMinutelyData?: boolean } : never = {} as typeof options,
): Promise<Map<number, number|undefined>> {
    const result = new Map<number, number|undefined>();
    if (!timestamps.length) return result;
    timestamps.sort((a, b) => a - b);

    let prices: Array<[number, number]>;
    switch (provider) {
        case Provider.CryptoCompare:
        case Provider.CryptoCompareLegacy:
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
            const disableMinutelyData = 'disableMinutelyData' in options ? !!options.disableMinutelyData : false;
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

// Rate limits for CryptoCompare's data-api and legacy min-api provide the same allowances but are tracked individually,
// as evident from the data-api still being usable, when the min-api rate limit is reached, and vice versa (tested Dec
// 2024).
// CryptoCompare grants different rate limits for different periods (see stats on /stats/rate/limit (for min-api), or
// response when exceeding limits). If the allowance for at least one time period is exceeded, the request is rejected.
// Experimentation showed that time periods are not rolling periods counting requests within the exact time period that
// ends at the current moment, but are fixed periods that start / end at fixed times based on the server time, e.g. days
// reset at midnight UTC, hours at the full hour etc.
// Different to CoinGecko, CryptoCompare counts rejected requests towards the API usage quota for rate limits.
const _cryptoCompareRateLimits = {
    second: 20,
    minute: 300,
    hour: 3000,
    // For month and day also just wait for the next hour, instead of waiting for the next day or month, in the hopes
    // that the user's IP changes, which would reset the user's rate limits. This can cause some unnecessary requests
    // counting towards the rate limit, but it's not many as we limit parallel requests to 1 once the daily or monthly
    // limit is hit, and they will be reset for the time period in question and all shorter time periods, once the next
    // day / month starts.
    // day: 7500,
    // month: 50000,
};
// CoinGecko allows a dynamic amount of requests per minute, typically around 5 requests per minute. However, as this is
// not a fixed value, we don't specify it as a fixed rate limit. Instead, to avoid sending off unnecessary requests
// while being rate limited, we send out requests sequentially, and pause the scheduler when a rate limit was hit.
// Different to CryptoCompare, CoinGecko doesn't count rejected requests towards the API usage quota for rate limits
// which, while not ideal, is why sending unnecessary requests for CoinGecko is not terribly bad.
const _coingeckoRateLimits = { parallel: 1 };
const _rateLimitSchedulers = {
    [Provider.CryptoCompare]: new RateLimitScheduler(_cryptoCompareRateLimits, 150),
    [Provider.CryptoCompareLegacy]: new RateLimitScheduler(_cryptoCompareRateLimits, 150),
    [Provider.CoinGecko]: new RateLimitScheduler(_coingeckoRateLimits),
    unlimited: new RateLimitScheduler({}),
};
async function _fetch<T>(info: RequestInfo, init?: RequestInit): Promise<T>;
async function _fetch<T>(info: RequestInfo, rateLimit?: Provider): Promise<T>;
async function _fetch<T>(info: RequestInfo, init?: RequestInit, rateLimit?: Provider): Promise<T>;
async function _fetch<T>(
    info: RequestInfo,
    initOrRateLimit?: RequestInit | Provider,
    rateLimit?: Provider,
): Promise<T> {
    let init: RequestInit | undefined;
    if (typeof initOrRateLimit === 'object') {
        init = initOrRateLimit;
    } else {
        rateLimit = initOrRateLimit;
    }
    const rateLimitScheduler = rateLimit ? _rateLimitSchedulers[rateLimit] : _rateLimitSchedulers.unlimited;

    let result: any = null;
    do {
        let response: Response;
        try {
            const initHeaders = init?.headers instanceof Headers || Array.isArray(init?.headers)
                ? init!.headers
                : Object.entries(init?.headers || {});
            const fetchTask = () => fetch(info, {
                ...init,
                headers: [
                    ...initHeaders,
                    ..._coinGeckoExtraHeaders,
                ],
            });
            response = await rateLimitScheduler.schedule(fetchTask); // eslint-disable-line no-await-in-loop
        } catch (e) {
            // fetch throws for example when user is offline.
            console.info('FiatApi failed to fetch. Retrying...', e); // eslint-disable-line no-console
            rateLimitScheduler.pause(20000);
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const parsedResponse = response.body ? await response.json() : null; // throws if response unexpectedly not json

        // CryptoCompare provides more information about an error, if any, in the response body, which isn't necessarily
        // reflected in the HTTP status code. While the legacy min-api responded with status code 200 even on errors,
        // the new data-api typically returns an HTTP error code, but might still also return 200 on partial errors, for
        // example if only one of multiple instruments is unknown.
        const cryptoCompareErrorType = parsedResponse?.Response === 'Error'
            ? parsedResponse.Type // for legacy min-api
            : parsedResponse?.Err?.type; // for new data-api
        const cryptoCompareErrorMessage = parsedResponse?.Response === 'Error'
            ? parsedResponse.Message // for legacy min-api
            : parsedResponse?.Err?.message; // for new data-api
        if (cryptoCompareErrorType === 99) {
            // CryptoCompare returns error type 99 when the rate limit is hit. The error message and other provided info
            // can differ. Basically, two different types of rate limits have been observed: regular rate limits, and
            // additional temporary banning when excessively spamming the API while being rate limited.
            // Observed error messages on regular rate limit are for the legacy min-api "You are over your rate limit
            // please upgrade your account!", and for the new data-api "Rate limit excedeed.", and on ban are for the
            // min-api no specific message, and for the data-api "You have been hard blocked for at least <x> seconds
            // beacuse you have made over 3x the allowed monthly limit of calls." For regular rate limits in the new
            // data-api and on ban in both APIs, additionally the sentence "Please use an API key for your calls. To get
            // an API key, go to https://www.cryptocompare.com/cryptopian/api-keys register, create a key and add it to
            // your requests as either ? or &api_key=<generated key>." is included.
            // On regular rate limits, additional info on the limits and current usage are included in the response, but
            // not on ban. On ban, the legacy min-api provides the cooldown wait time in seconds, but the new data-api
            // does not, apart from the info in the message.
            // The regular rate limit occurs, when the usage in one period exceeds the rate limit for that period. The
            // ban happens when continuing to excessively spam the API during rate limits, or maybe also on excessively
            // many parallel requests. On experimentation with the new API, the ban happened once exceeding three times
            // the daily limit (not three times the monthly limit as the message wronly says).
            // Note that rate limits can be hit, even though we're using a RateLimitScheduler, for example because it
            // doesn't know about previous usages until we get this info on hitting a rate limit, or because we're
            // ignoring monthly and daily limits, or the system clock might differ from the server clock, and thus
            // usages reset at different times, or due to the async nature of requests, or due to the API also being
            // used in other tabs or apps.
            // eslint-disable-next-line no-console
            console.info(`FiatApi hit CryptoCompare rate limit: ${cryptoCompareErrorMessage}. Retrying...`);
            const cooldown = parsedResponse.Cooldown // for legacy min-api
                || Number.parseInt(cryptoCompareErrorMessage?.match(/\d+ seconds?/)?.[0] || '', 10); // for new data-api
            const rateLimitInfo = [
                parsedResponse.RateLimit, // for legacy min-api
                parsedResponse.Err?.other_info, // for new data-api
            ].find((info) => ['month', 'day', 'hour', 'minute', 'second'].every(
                (timePeriod) => typeof info?.calls_made?.[timePeriod] === 'number'
                    && typeof info?.max_calls?.[timePeriod] === 'number',
            ));
            if (cooldown) {
                rateLimitScheduler.pause(cooldown * 1000);
            } else if (rateLimitInfo) {
                const { calls_made: usages, max_calls: limits } = rateLimitInfo;
                // Set usages with mode increase-only, for highest usages to eventually survive, in case of responses of
                // parallel requests arriving out of order, and to avoid removing counts of additional requests sent in
                // the meantime.
                rateLimitScheduler.setUsages(usages, 'increase-only');
                // Ignore daily and monthly limits in hopes of the usage being reset earlier than on day or month reset,
                // for example by IP change, but limit parallel requests when the daily or monthly limit is hit to avoid
                // unnecessary parallel requests, see above. The parallel limit is reset on the next successful request.
                if (usages.day > limits.day || usages.month > limits.month) {
                    limits.parallel = 1;
                }
                delete limits.day;
                delete limits.month;
                rateLimitScheduler.setRateLimits(limits);
            } else {
                // eslint-disable-next-line no-console
                console.error('FiatApi got unexpected CryptoCompare rate limit response', parsedResponse);
                // To reduce the chance of sending off unnecessary rejected requests while we're rate limited, add an
                // extra pause on top of the configured rate limits. The time is chosen in a way to try to make use of
                // the allowed requests per minute (until the hourly limit is reached) based on the limit per second.
                const limits = rateLimitScheduler.getRateLimits();
                const waitTime = limits.minute && limits.second ? ONE_MINUTE / (limits.minute / limits.second) : 4000;
                rateLimitScheduler.pause(waitTime);
            }
            continue;
        }
        if (cryptoCompareErrorType) {
            // On other CryptoCompare errors, do not retry, e.g. for api calls that require an API key.
            throw new Error(
                `FiatApi got CryptoCompare error ${cryptoCompareErrorType}: ${cryptoCompareErrorMessage}`,
                { cause: parsedResponse.Err },
            );
        }

        if (response.status === 429) {
            // Handle rate limits of other APIs, including CoinGecko.
            // Unfortunately, for CoinGecko we can not implement more specific rate limit handling. CoinGecko's response
            // headers tell us when our next minute starts, but unfortunately due to cors we can not access this info.
            // Therefore, we blindly retry after waiting some time. Note that CoinGecko resets the quota solely based on
            // their system time, i.e. independent of when we resend our request. Therefore, we do not waste time/part
            // of our quota by waiting a bit longer.
            console.info(`FiatApi hit ${rateLimit || ''} rate limit. Retrying...`); // eslint-disable-line no-console
            rateLimitScheduler.pause(15000);
            continue;
        }

        if (!response.ok) {
            // On other errors, do not retry.
            throw new Error(`FiatApi failed to fetch: ${response.status} - ${response.statusText}`);
        }

        // Successful response
        if ((rateLimit === Provider.CryptoCompare || rateLimit === Provider.CryptoCompareLegacy)
            && rateLimitScheduler.getRateLimits().parallel) {
            // If we limited the parallel CryptoCompare requests after hitting the daily or monthly limit, reset that
            // limit of parallel requests after the next successful request.
            const limits = rateLimitScheduler.getRateLimits();
            delete limits.parallel;
            rateLimitScheduler.setRateLimits(limits);
        }
        result = parsedResponse;
    } while (!result);
    return result;
}

export function isProviderSupportedFiatCurrency<P extends Provider, T extends RateType>(
    currency: unknown,
    provider: P,
    rateType: T,
): currency is ProviderFiatCurrency<P, T> {
    const providerFiatCurrencies = {
        [Provider.CryptoCompare]: CRYPTOCOMPARE_FIAT_CURRENCIES,
        [Provider.CryptoCompareLegacy]: {
            [RateType.CURRENT]: CRYPTOCOMPARE_LEGACY_CURRENT_RATES_FIAT_CURRENCIES,
            [RateType.HISTORIC]: CRYPTOCOMPARE_LEGACY_HISTORIC_RATES_FIAT_CURRENCIES,
        }[rateType],
        [Provider.CoinGecko]: COINGECKO_FIAT_CURRENCIES,
    }[provider];
    return providerFiatCurrencies.includes(currency as any);
}

export function isBridgeableFiatCurrency(currency: unknown): currency is BridgeableFiatCurrency {
    return BRIDGEABLE_FIAT_CURRENCIES.includes(currency as any);
}

export function isBridgedFiatCurrency<P extends Provider, T extends RateType>(
    currency: unknown,
    provider: P,
    rateType: T,
): currency is Exclude<BridgeableFiatCurrency, ProviderFiatCurrency<P, T>> {
    return isBridgeableFiatCurrency(currency) && !isProviderSupportedFiatCurrency(currency, provider, rateType);
}

export function isHistorySupportedFiatCurrency<P extends Provider>(currency: unknown, provider: P)
: currency is ProviderFiatCurrency<P, RateType.HISTORIC> | HistoryBridgeableFiatCurrency {
    return isProviderSupportedFiatCurrency(currency, provider, RateType.HISTORIC)
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
