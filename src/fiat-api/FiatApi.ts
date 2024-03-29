// Note that coingecko supports many more but these are the ones that are currently of interest to us
export enum FiatApiSupportedCryptoCurrency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
    USDC = 'usdc',
}

// Fiat currencies supported by coingecko.
// Note that coingecko supports more vs_currencies (see https://api.coingecko.com/api/v3/simple/supported_vs_currencies)
// but also includes crypto currencies and ounces of gold amongst others that are not fiat currencies. This list here
// has been generated by reducing the vs_currencies to those that are listed as a circulating currency on
// https://en.wikipedia.org/wiki/List_of_circulating_currencies#List_of_circulating_currencies_by_state_or_territory
// via the following script:
//
// const referenceCurrencySymbols = { ...parsed from Wikipedia as described in CurrencyInfo.ts };
// const FiatApiSupportedFiatCurrency = { ...as defined below };
// const supportedVsCurrencies = (await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
//     .then((response) => response.json()))
//     .map((currency) => currency.toUpperCase());
// for (const currency of supportedVsCurrencies) {
//     if (currency in referenceCurrencySymbols && !(currency in FiatApiSupportedFiatCurrency)) {
//         console.log(`${currency} is a new supported currency`);
//     }
// }
// for (const currency of Object.keys(FiatApiSupportedFiatCurrency)) {
//     if (!supportedVsCurrencies.includes(currency)) {
//         console.log(`${currency} is not supported anymore`);
//     }
//     if (!(currency in referenceCurrencySymbols)) {
//         console.log(`${currency} is not a circulating currency anymore`);
//     }
// }
export enum FiatApiSupportedFiatCurrency {
    AED = 'aed', // Arab Emirates Dirham
    ARS = 'ars', // Argentine Peso
    AUD = 'aud', // Australian Dollar
    BDT = 'bdt', // Bangladeshi Taka
    BHD = 'bhd', // Bahraini Dinar
    BMD = 'bmd', // Bermudan Dollar
    BRL = 'brl', // Brazilian Real
    CAD = 'cad', // Canadian Dollar
    CHF = 'chf', // Swiss Franc
    CLP = 'clp', // Chilean Peso
    CNY = 'cny', // Chinese Yuan
    CZK = 'czk', // Czech Koruna
    DKK = 'dkk', // Danish Krone
    EUR = 'eur', // Euro
    GBP = 'gbp', // British Pound
    GEL = 'gel', // Georgian Lari
    HKD = 'hkd', // Hong Kong Dollar
    HUF = 'huf', // Hungarian Forint
    IDR = 'idr', // Indonesian Rupiah
    ILS = 'ils', // Israeli New Shekel
    INR = 'inr', // Indian Rupee
    JPY = 'jpy', // Japanese Yen
    KRW = 'krw', // South Korean Won
    KWD = 'kwd', // Kuwaiti Dinar
    LKR = 'lkr', // Sri Lankan Rupee
    MMK = 'mmk', // Burmese Kyat
    MXN = 'mxn', // Mexican Peso
    MYR = 'myr', // Malaysian Ringgit
    NOK = 'nok', // Norwegian Krone
    NGN = 'ngn', // Nigerian Naira
    NZD = 'nzd', // New Zealand Dollar
    PHP = 'php', // Philippine Peso
    PKR = 'pkr', // Pakistani Rupee
    PLN = 'pln', // Poland Złoty
    RUB = 'rub', // Russian Ruble
    SAR = 'sar', // Saudi Riyal
    SEK = 'sek', // Swedish Krona
    SGD = 'sgd', // Singapore Dollar
    THB = 'thb', // Thai Baht
    TRY = 'try', // Turkish Lira
    TWD = 'twd', // New Taiwan Dollar
    UAH = 'uah', // Ukrainian Hryvnia
    USD = 'usd', // United States Dollar
    // VEF = 'vef', // Discontinued Venezuelan Bolívar Fuerte which was replaced by VES. Rates are completely off.
    VND = 'vnd', // Vietnamese Đồng
    ZAR = 'zar', // South African Rand
}

// Additionally supported fiat currencies, which are not directly supported by Coingecko, but for which we calculate
// exchange rates by combining coin/USD and fiat/USD rates. Not all of these support also fetching historic exchange
// rates. Those that do, are listed in FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES and can be checked for via
// isHistorySupportedFiatCurrency(currency).
// This list has been generated via the following script:
//
// const FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES = [ ... as defined below ];
// const FiatApiSupportedFiatCurrency = { ... as defined above };
// const cplData = await fetch('https://firestore.googleapis.com/v1/projects/checkout-service/databases/(default)/'
//     + 'documents/exchangerates/rates').then((response) => response.json());
// const cplCurrencies = Object.keys(cplData.fields.rates.mapValue.fields)
//     .map((currency) => currency.toUpperCase())
//     .filter((currency) => !(currency in FiatApiSupportedFiatCurrency)
//         && !FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES.includes(currency))
//     .sort();
// const formatCurrencies = (currencies) => currencies
//     .map((currency) => `    ${currency.toUpperCase()} = '${currency.toLowerCase()}',\n`)
//     .join('');
// console.log('{\n'
//     + '    // History supported bridged fiat currencies:\n'
//     + formatCurrencies(FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES)
//     + '\n    // CPL API currencies:\n'
//     + formatCurrencies(cplCurrencies)
//     + '}');
export enum FiatApiBridgedFiatCurrency {
    // History supported bridged fiat currencies:
    CRC = 'crc', // Costa Rican colón

    // CPL API currencies:
    AFN = 'afn', // Afghan afghani
    ALL = 'all', // Albanian lek
    AMD = 'amd', // Armenian dram
    ANG = 'ang', // Netherlands Antillean guilder
    AOA = 'aoa', // Angolan kwanza
    AWG = 'awg', // Aruban florin
    AZN = 'azn', // Azerbaijani manat
    BAM = 'bam', // Bosnia and Herzegovina convertible mark
    BBD = 'bbd', // Barbadian dollar
    BGN = 'bgn', // Bulgarian lev
    BIF = 'bif', // Burundian franc
    BND = 'bnd', // Brunei dollar
    BOB = 'bob', // Bolivian boliviano
    BSD = 'bsd', // Bahamian dollar
    // BTC = 'btc', // Bitcoin; not a fiat currency
    BTN = 'btn', // Bhutanese ngultrum
    BWP = 'bwp', // Botswana pula
    BYN = 'byn', // Belarusian ruble
    BZD = 'bzd', // Belize dollar
    CDF = 'cdf', // Congolese franc
    // CLF = 'clf', // Chilean Unidad de Fomento; a trade unit; not a fiat currency
    // CNH = 'cnh', // A Chinese trade unit; not a fiat currency
    COP = 'cop', // Colombian peso
    // CUC = 'cuc', // old Cuban convertible peso; replaced by CUP
    CUP = 'cup', // Cuban peso
    CVE = 'cve', // Cape Verdean escudo
    DJF = 'djf', // Djiboutian franc
    DOP = 'dop', // Dominican peso
    DZD = 'dzd', // Algerian dinar
    EGP = 'egp', // Egyptian pound
    ERN = 'ern', // Eritrean nakfa
    ETB = 'etb', // Ethiopian birr
    FJD = 'fjd', // Fijian dollar
    FKP = 'fkp', // Falkland Islands pound
    // GGP = 'ggp', // Guernsey pound; at parity with sterling; not a separate ISO 4217 currency
    GHS = 'ghs', // Ghanaian cedi
    GIP = 'gip', // Gibraltar pound
    GMD = 'gmd', // Gambian dalasi
    GNF = 'gnf', // Guinean franc
    GTQ = 'gtq', // Guatemalan quetzal
    GYD = 'gyd', // Guyanese dollar
    HNL = 'hnl', // Honduran lempira
    // HRK = 'hrk', // old Croatian Kuna; non-circulating currency
    HTG = 'htg', // Haitian gourde
    // IMP = 'imp', // Manx pound; at parity with sterling; not a separate ISO 4217 currency
    IQD = 'iqd', // Iraqi dinar
    IRR = 'irr', // Iranian rial
    ISK = 'isk', // Icelandic króna
    // JEP = 'jep', // Jersey pound; at parity with sterling; not a separate ISO 4217 currency
    JMD = 'jmd', // Jamaican dollar
    JOD = 'jod', // Jordanian dinar
    KES = 'kes', // Kenyan shilling
    KGS = 'kgs', // Kyrgyz som
    KHR = 'khr', // Cambodian riel
    KMF = 'kmf', // Comorian franc
    KPW = 'kpw', // North Korean won
    KYD = 'kyd', // Cayman Islands dollar
    KZT = 'kzt', // Kazakhstani tenge
    LAK = 'lak', // Lao kip
    LBP = 'lbp', // Lebanese pound
    LRD = 'lrd', // Liberian dollar
    LSL = 'lsl', // Lesotho loti
    LYD = 'lyd', // Libyan dinar
    MAD = 'mad', // Moroccan dirham
    MDL = 'mdl', // Moldovan leu
    MGA = 'mga', // Malagasy ariary
    MKD = 'mkd', // Macedonian denar
    MNT = 'mnt', // Mongolian tögrög
    MOP = 'mop', // Macanese pataca
    MRU = 'mru', // Mauritanian ouguiya
    MUR = 'mur', // Mauritian rupee
    MVR = 'mvr', // Maldivian rufiyaa
    MWK = 'mwk', // Malawian kwacha
    MZN = 'mzn', // Mozambican metical
    NAD = 'nad', // Namibian dollar
    NIO = 'nio', // Nicaraguan córdoba
    NPR = 'npr', // Nepalese rupee
    OMR = 'omr', // Omani rial
    PAB = 'pab', // Panamanian balboa
    PEN = 'pen', // Peruvian sol
    PGK = 'pgk', // Papua New Guinean kina
    PYG = 'pyg', // Paraguayan guaraní
    QAR = 'qar', // Qatari riyal
    RON = 'ron', // Romanian leu
    RSD = 'rsd', // Serbian dinar
    RWF = 'rwf', // Rwandan franc
    SBD = 'sbd', // Solomon Islands dollar
    SCR = 'scr', // Seychellois rupee
    SDG = 'sdg', // Sudanese pound
    SHP = 'shp', // Saint Helena pound
    // SLL = 'sll', // old Sierra Leonean leone; replaced by SLE
    SOS = 'sos', // Somali shilling
    SRD = 'srd', // Surinamese dollar
    SSP = 'ssp', // South Sudanese pound
    // STD = 'std', // old São Tomé and Príncipe dobra; replaced by STN
    STN = 'stn', // São Tomé and Príncipe dobra
    // SVC = 'svc', // old El Salvadorian colón; replaced by USD
    SYP = 'syp', // Syrian pound
    SZL = 'szl', // Swazi lilangeni
    TJS = 'tjs', // Tajikistani somoni
    TMT = 'tmt', // Turkmenistani manat
    TND = 'tnd', // Tunisian dinar
    TOP = 'top', // Tongan paʻanga
    TTD = 'ttd', // Trinidad and Tobago dollar
    TZS = 'tzs', // Tanzanian shilling
    UGX = 'ugx', // Ugandan shilling
    UYU = 'uyu', // Uruguayan peso
    UZS = 'uzs', // Uzbekistani sum
    VES = 'ves', // Venezuelan sovereign bolívar
    VUV = 'vuv', // Vanuatu vatu
    WST = 'wst', // Samoan tālā
    XAF = 'xaf', // Central African CFA franc
    // XAG = 'xag', // Silver; not a fiat currency
    // XAU = 'xau', // Gold; not a fiat currency
    XCD = 'xcd', // Eastern Caribbean dollar
    // XDR = 'xdr', // special drawing right issued by the International Monetary Fund; not a fiat currency
    XOF = 'xof', // West African CFA franc
    // XPD = 'xpd', // Palladium; not a fiat currency
    XPF = 'xpf', // CFP franc
    // XPT = 'xpt', // Platinum; not a fiat currency
    YER = 'yer', // Yemeni rial
    ZMW = 'zmw', // Zambian kwacha
    ZWL = 'zwl', // Zimbabwean dollar
}

// Check that no currency supported directly by Coingecko is handled as bridged currency.
// If there is no overlap, the Extract should yield type never, which is a valid index for the empty object. However, if
// there is an overlap, the result of Extract will be non-empty, which is an invalid index for {}.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type __expectNoCoingeckoWithBridgedOverlap = {}[Extract<
    keyof typeof FiatApiBridgedFiatCurrency,
    keyof typeof FiatApiSupportedFiatCurrency
>];

const FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES = [FiatApiBridgedFiatCurrency.CRC as const];
export type FiatApiHistorySupportedBridgedFiatCurrency = (typeof FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES)[
    number];

const HISTORY_SUPPORTED_BRIDGED_CURRENCY_TIMEZONES = {
    [FiatApiBridgedFiatCurrency.CRC]: 'America/Costa_Rica',
} as const;
// Also checks no FiatApiHistorySupportedBridgedFiatCurrency is missing in HISTORY_SUPPORTED_BRIDGED_CURRENCY_TIMEZONES
type HistorySupportedBridgedCurrencyTimezone = (typeof HISTORY_SUPPORTED_BRIDGED_CURRENCY_TIMEZONES)[
    FiatApiHistorySupportedBridgedFiatCurrency];

// Bridged fiat currencies using CryptoPayment.link API as bridge. Notably, these do not support historic rates.
// In reality, more currencies are supported, check for what's included in the response returned by the api.
type CplApiBridgedFiatCurrency = Exclude<FiatApiBridgedFiatCurrency, FiatApiHistorySupportedBridgedFiatCurrency>;
const CPL_API_BRIDGED_FIAT_CURRENCIES: Array<CplApiBridgedFiatCurrency> = Object.values(FiatApiBridgedFiatCurrency)
    .filter((currency): currency is CplApiBridgedFiatCurrency => (
        !FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES.includes(currency as any)
    ));

const API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_COIN_IDS = {
    [FiatApiSupportedCryptoCurrency.NIM]: 'nimiq-2',
    [FiatApiSupportedCryptoCurrency.BTC]: 'bitcoin',
    [FiatApiSupportedCryptoCurrency.ETH]: 'ethereum',
    [FiatApiSupportedCryptoCurrency.USDC]: 'usd-coin',
};

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

type VsCurrency = FiatApiSupportedFiatCurrency | FiatApiBridgedFiatCurrency | FiatApiSupportedCryptoCurrency;
export async function getExchangeRates<C extends FiatApiSupportedCryptoCurrency, V extends VsCurrency>(
    cryptoCurrencies: C[],
    vsCurrencies: V[],
): Promise<Record<C, Record<V, number | undefined>>> {
    // Make sure the currencies are lower case to match the enums (for users that might not be using typescript which
    // ensures that only valid currency tickers are passed).
    cryptoCurrencies = cryptoCurrencies.map((currency) => currency.toLowerCase() as C);
    vsCurrencies = vsCurrencies.map((currency) => currency.toLowerCase() as V);
    // vsCurrencies handled by coingecko. Potentially extended by USD.
    const coingeckoVsCurrencies: Array<FiatApiSupportedFiatCurrency | FiatApiSupportedCryptoCurrency> = [];
    const bridgedVsCurrencies: Array<FiatApiBridgedFiatCurrency> = [];
    for (const currency of vsCurrencies) {
        if (!isBridgedFiatCurrency(currency)) {
            coingeckoVsCurrencies.push(currency);
        } else {
            bridgedVsCurrencies.push(currency);
        }
    }

    // Check for bridged currencies and fetch their USD exchange rates
    let bridgedExchangeRatesPromise: Promise<Partial<Record<FiatApiBridgedFiatCurrency, number|undefined>>> | undefined;
    if (bridgedVsCurrencies.length) {
        bridgedExchangeRatesPromise = _getBridgedFiatCurrencyExchangeRates(bridgedVsCurrencies);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate.
        if (!coingeckoVsCurrencies.includes(FiatApiSupportedFiatCurrency.USD)) {
            coingeckoVsCurrencies.push(FiatApiSupportedFiatCurrency.USD);
        }
    }

    const coinIds = cryptoCurrencies.map((currency) => COINGECKO_COIN_IDS[currency]);
    const coingeckoExchangeRatesPromise = _fetch<Record<string, Record<string, number>>>(`${API_URL}/simple/price`
        + `?ids=${coinIds.join(',')}&vs_currencies=${coingeckoVsCurrencies.join(',')}`);
    const [
        coingeckoExchangeRates,
        bridgedExchangeRates,
    ] = await Promise.all([coingeckoExchangeRatesPromise, bridgedExchangeRatesPromise]);
    // Map coingecko coin ids back to FiatApiSupportedCryptoCurrency enum
    const prices = cryptoCurrencies.reduce((result, cryptoCurrency) => ({
        ...result,
        [cryptoCurrency]: coingeckoExchangeRates[COINGECKO_COIN_IDS[cryptoCurrency]],
    }), {} as Record<C, Record<V, number | undefined>>);

    // Add prices calculated from bridged exchange rates, if any.
    for (const [bridgedCurrency, bridgedExchangeRate] of Object.entries(bridgedExchangeRates || {})) {
        for (const coinPrices of Object.values<Record<V, number | undefined>>(prices)) {
            const coinUsdPrice = coinPrices[FiatApiSupportedFiatCurrency.USD as V];
            coinPrices[bridgedCurrency as V] = bridgedExchangeRate && coinUsdPrice
                ? bridgedExchangeRate * coinUsdPrice
                : undefined;
        }
    }

    // Strictly speaking, USD would need to be filtered out if it was added, but we skip that for code simplicity.
    return prices;
}

/**
 * Request historic exchange rates by range. Note that the time resolution depends on the chosen range. Coingecko
 * provides minutely for ranges within 1 day from the current time, hourly data for any ranges between 1 day and 90 days
 * (do not need to be within 90 days from current time) and daily for ranges above 90 days.
 * Note that minutely data is ~5-10 minutes apart, hourly data about an hour.
 * Input and output timestamps are in milliseconds.
 */
export async function getHistoricExchangeRatesByRange(
    cryptoCurrency: FiatApiSupportedCryptoCurrency,
    vsCurrency: FiatApiSupportedFiatCurrency | FiatApiHistorySupportedBridgedFiatCurrency
        | FiatApiSupportedCryptoCurrency,
    from: number, // in milliseconds
    to: number, // in milliseconds
): Promise<Array<[number, number]>> {
    let bridgedCurrency: FiatApiHistorySupportedBridgedFiatCurrency | undefined;
    let bridgedExchangeRatePromise: Promise<{[date: string]: number | undefined}> | undefined;
    if (isBridgedFiatCurrency(vsCurrency)) {
        bridgedCurrency = vsCurrency;
        bridgedExchangeRatePromise = _getHistoricBridgedFiatCurrencyExchangeRatesByRange(bridgedCurrency, from, to);
        // Bridged exchange rates are to USD, therefore we need to get the USD exchange rate, too.
        vsCurrency = FiatApiSupportedFiatCurrency.USD;
    }

    const coinId = COINGECKO_COIN_IDS[cryptoCurrency.toLowerCase() as FiatApiSupportedCryptoCurrency];
    // Note that from and to are expected in seconds but returned timestamps are in ms.
    from = Math.floor(from / 1000);
    to = Math.ceil(to / 1000);
    const [
        { prices: coingeckoHistoricRates },
        bridgedHistoricRates,
    ] = await Promise.all([
        _fetch<{ prices: Array<[number, number]> }>(
            `${API_URL}/coins/${coinId}/market_chart/range?vs_currency=${vsCurrency}&from=${from}&to=${to}`,
        ),
        bridgedExchangeRatePromise,
    ]);

    if (bridgedCurrency && bridgedHistoricRates) {
        // Convert exchange rates to bridged currency and omit entries for which no bridged exchange rate is available.
        return coingeckoHistoricRates.map(([timestamp, coinUsdPrice]) => {
            const date = _getDateString(timestamp, HISTORY_SUPPORTED_BRIDGED_CURRENCY_TIMEZONES[bridgedCurrency!]);
            const bridgedHistoricRate = bridgedHistoricRates[date];
            return bridgedHistoricRate ? [timestamp, coinUsdPrice * bridgedHistoricRate] : null;
        }).filter((entry): entry is [number, number] => entry !== null);
    }

    return coingeckoHistoricRates;
}

/**
 * Get historic exchange rates at specific timestamps in milliseconds.
 */
export async function getHistoricExchangeRates(
    cryptoCurrency: FiatApiSupportedCryptoCurrency,
    vsCurrency: FiatApiSupportedFiatCurrency | FiatApiHistorySupportedBridgedFiatCurrency
        | FiatApiSupportedCryptoCurrency,
    timestamps: number[],
    disableMinutlyData = false,
): Promise<Map<number, number|undefined>> {
    const result = new Map<number, number|undefined>();
    if (!timestamps.length) return result;

    // 1. Create chunks.
    // To get the best possible time resolution, we split the timestamps into a chunk within at most 1 day from now
    // and the rest into additional 90 day chunks.
    const now = Date.now();
    const chunks: Array<{ start: number, end: number }> = [];
    let timestampIndex = timestamps.length - 1;
    timestamps.sort((a, b) => a - b);

    // Create one day chunk
    if (!disableMinutlyData && now - timestamps[timestamps.length - 1] < ONE_DAY - 15 * ONE_MINUTE) {
        // Has a timestamp within last day (minus safety margin in case our clock is slightly off).
        // As one day is calculated from now and not from the timestamp, we have to account for the difference
        // between now and the timestamp.
        const maxChunkLength = ONE_DAY - 15 * ONE_MINUTE - (now - timestamps[timestamps.length - 1]);
        const { chunk, searchEndIndex } = _findTimestampChunk(
            timestamps,
            timestampIndex,
            maxChunkLength,
            // Prices are 5-10 min apart, chose margin such we get earlier and later data point for interpolation
            10 * ONE_MINUTE,
        );
        chunks.push(chunk);
        timestampIndex = searchEndIndex;
    }

    // Create additional 90 day chunks
    while (timestampIndex >= 0) {
        const { chunk, searchEndIndex } = _findTimestampChunk(
            timestamps,
            timestampIndex,
            90 * ONE_DAY,
            // Prices are ~1h apart, chose margin such we get earlier and later data point for interpolation
            1.5 * ONE_HOUR,
        );
        chunks.push(chunk);
        timestampIndex = searchEndIndex;
    }

    // 2. Query Coingecko Api
    const fetchPromises = chunks.map(
        (chunk) => getHistoricExchangeRatesByRange(cryptoCurrency, vsCurrency, chunk.start, chunk.end),
    );
    const prices = (await Promise.all(fetchPromises)).reduce(
        (accumulated, singleResult) => [...singleResult, ...accumulated],
        [] as Array<[number, number]>,
    ).sort((a, b) => a[0] - b[0]); // have to re-sort by timestamp as chunks might be overlapping
    if (!prices.length) return result; // Happens if coingecko doesn't have data for any of requested timestamps,
    // for example for days before coingecko started collecting Nim price info or for days in the future.

    // 3. For every requested timestamp interpolate the price from the timestamps we got from the API
    timestampIndex = 0;
    let priceIndex = 0;
    while (timestampIndex < timestamps.length) {
        // Search priceIndex at which predecessor price timestamp < our timestamp <= current price timestamp.
        const timestamp = timestamps[timestampIndex];
        while (priceIndex < prices.length && prices[priceIndex][0] < timestamp) {
            ++priceIndex;
        }
        if (priceIndex === 0 || priceIndex === prices.length) {
            // Can't interpolate. This should typically not happen as we try to include additional data points
            // for interpolation by our choice of _findTimestampChunk margins. However, this can still occur in
            // exceptional cases when the gap between two data points was larger than our margin or the requested
            // timestamp was before coingecko even started recording price data or is in the future.
            const priceEntry = prices[Math.min(priceIndex, prices.length - 1)];
            if (Math.abs(timestamp - priceEntry[0]) < 2 * ONE_DAY && timestamp <= now) {
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

function _findTimestampChunk(
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

async function _fetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let result: T | null = null;
    do {
        let retry = true;
        try {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(input, init); // throws when user is offline
            if (!response.ok) {
                if (response.status === 400) {
                    retry = false;
                    throw new Error('400 - Bad request');
                }
                throw new Error(`Failed to fetch: ${response.status}. Retrying...`);
            }
            // eslint-disable-next-line no-await-in-loop
            result = await response.json();
        } catch (e) {
            // User might be offline or we ran into coingecko's rate limiting. Coingecko allows 100 requests
            // per minute and tells us in the response headers when our next minute starts, but unfortunately
            // due to cors we can not access this information. Therefore, we blindly retry after waiting some
            // time. Note that coingecko resets the quota solely based on their system time, i.e. independent
            // of when we resend our request. Therefore, we do not waste time/part of our quota by waiting a
            // bit longer. Note however, that we do not prioritize between our fetches, therefore they will
            // be resolved in random order.
            if (retry) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => { setTimeout(resolve, 15000); });
            } else {
                throw e;
            }
        }
    } while (!result);
    return result;
}

export function isBridgedFiatCurrency(currency: unknown): currency is FiatApiBridgedFiatCurrency {
    return Object.values(FiatApiBridgedFiatCurrency).includes(currency as any);
}

export function isHistorySupportedFiatCurrency(currency: unknown)
: currency is FiatApiSupportedFiatCurrency | FiatApiHistorySupportedBridgedFiatCurrency {
    return Object.values(FiatApiSupportedFiatCurrency).includes(currency as any)
        || FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES.includes(currency as any);
}

/**
 * Get today's exchange rates to USD. Rates can be undefined if the user's clock is in the future.
 */
async function _getBridgedFiatCurrencyExchangeRates<B extends FiatApiBridgedFiatCurrency>(bridgedFiatCurrencies: B[])
: Promise<Record<B, number | undefined>> {
    const apiPromises: Array<Promise<Partial<Record<B, number | undefined>>>> = [];

    if (bridgedFiatCurrencies.includes(FiatApiBridgedFiatCurrency.CRC as B)) {
        apiPromises.push(_getHistoricBridgedFiatCurrencyExchangeRatesByRange(
            FiatApiBridgedFiatCurrency.CRC,
            Date.now(),
        ).then((crcExchangeRates): Partial<Record<FiatApiBridgedFiatCurrency, number | undefined>> => ({
            // There is only a single entry in crcExchangeRates, if any, which is for the current date.
            [FiatApiBridgedFiatCurrency.CRC]: Object.values(crcExchangeRates)[0],
        })));
    }

    const cplApiFiatCurrencies = CPL_API_BRIDGED_FIAT_CURRENCIES.filter((c) => bridgedFiatCurrencies.includes(c as B));
    if (cplApiFiatCurrencies.length) {
        apiPromises.push(_fetch<FirebaseRawResponse>(
            'https://firestore.googleapis.com/v1/projects/checkout-service/databases/(default)/documents/'
                + 'exchangerates/rates',
        ).then((cplExchangeRatesResponse) => {
            const cplExchangeRates = _parseCplExchangeRateResponse(cplExchangeRatesResponse);
            // Reduce to only the requested cplApiFiatCurrencies.
            return cplApiFiatCurrencies.reduce((result, currency) => ({
                ...result,
                [currency]: cplExchangeRates[currency],
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
async function _getHistoricBridgedFiatCurrencyExchangeRatesByRange(
    bridgedFiatCurrency: FiatApiHistorySupportedBridgedFiatCurrency,
    from: number, // in milliseconds, inclusive
    to: number = from, // in milliseconds, inclusive
): Promise<{[date: string]: number | undefined}> {
    if (!FIAT_API_HISTORY_SUPPORTED_BRIDGED_FIAT_CURRENCIES.includes(bridgedFiatCurrency)) {
        // Currently only supported for CRC. Check for users that don't use typescript.
        throw new Error(`Unsupported bridged currency for historic rates: ${bridgedFiatCurrency}`);
    }
    const timezone = HISTORY_SUPPORTED_BRIDGED_CURRENCY_TIMEZONES[bridgedFiatCurrency];
    const fromDate = _getDateString(from, timezone);
    const toDate = to === from ? fromDate : _getDateString(to, timezone);
    // Note: entries for future dates are omitted and thus basically undefined which is reflected in the return type.
    return _fetch<{[date: string]: number}>(`https://usd-crc-historic-rate.deno.dev/api/rates/${fromDate}/${toDate}`);
}

/**
 * Format a timestamp as a YYYY-MM-DD date string in a desired timezone.
 */
function _getDateString(timestamp: number | Date, timezone: HistorySupportedBridgedCurrencyTimezone): string {
    // Define as record such that ts warns us if an entry is missing
    const timezoneUtcOffsets: Record<HistorySupportedBridgedCurrencyTimezone, number> = {
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
