export declare enum FiatApiSupportedCryptoCurrency {
    NIM = "nim",
    BTC = "btc",
    ETH = "eth",
    USDC = "usdc"
}
export declare enum FiatApiSupportedFiatCurrency {
    AED = "aed",
    ARS = "ars",
    AUD = "aud",
    BDT = "bdt",
    BHD = "bhd",
    BMD = "bmd",
    BRL = "brl",
    CAD = "cad",
    CHF = "chf",
    CLP = "clp",
    CNY = "cny",
    CZK = "czk",
    DKK = "dkk",
    EUR = "eur",
    GBP = "gbp",
    HKD = "hkd",
    HUF = "huf",
    IDR = "idr",
    ILS = "ils",
    INR = "inr",
    JPY = "jpy",
    KRW = "krw",
    KWD = "kwd",
    LKR = "lkr",
    MMK = "mmk",
    MXN = "mxn",
    MYR = "myr",
    NOK = "nok",
    NGN = "ngn",
    NZD = "nzd",
    PHP = "php",
    PKR = "pkr",
    PLN = "pln",
    RUB = "rub",
    SAR = "sar",
    SEK = "sek",
    SGD = "sgd",
    THB = "thb",
    TRY = "try",
    TWD = "twd",
    UAH = "uah",
    USD = "usd",
    VND = "vnd",
    ZAR = "zar"
}
export declare enum FiatApiBridgedFiatCurrency {
    CRC = "crc"
}
export declare function getExchangeRates(cryptoCurrencies: Array<FiatApiSupportedCryptoCurrency>, vsCurrencies: Array<FiatApiSupportedFiatCurrency | FiatApiBridgedFiatCurrency | FiatApiSupportedCryptoCurrency>): Promise<{
    [crypto: string]: {
        [vsCurrency: string]: number | undefined;
    };
}>;
/**
 * Request historic exchange rates by range. Note that the time resolution depends on the chosen range. Coingecko
 * provides minutely for ranges within 1 day from the current time, hourly data for any ranges between 1 day and 90 days
 * (do not need to be within 90 days from current time) and daily for ranges above 90 days.
 * Note that minutely data is ~5-10 minutes apart, hourly data about an hour.
 * Input and output timestamps are in milliseconds.
 */
export declare function getHistoricExchangeRatesByRange(cryptoCurrency: FiatApiSupportedCryptoCurrency, vsCurrency: FiatApiSupportedFiatCurrency | FiatApiBridgedFiatCurrency | FiatApiSupportedCryptoCurrency, from: number, // in milliseconds
to: number): Promise<Array<[number, number]>>;
/**
 * Get historic exchange rates at specific timestamps in milliseconds.
 */
export declare function getHistoricExchangeRates(cryptoCurrency: FiatApiSupportedCryptoCurrency, vsCurrency: FiatApiSupportedFiatCurrency | FiatApiBridgedFiatCurrency | FiatApiSupportedCryptoCurrency, timestamps: number[], disableMinutlyData?: boolean): Promise<Map<number, number | undefined>>;
