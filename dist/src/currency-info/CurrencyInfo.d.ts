export declare class CurrencyInfo {
    private static readonly EXTRA_SYMBOLS;
    private static readonly CUSTOM_DECIMAL_LESS_CURRENCIES;
    private static readonly CACHED_AUTO_GENERATED_CURRENCY_INFOS;
    private static readonly CURRENCY_CODE_REGEX;
    private static readonly NUMBER_REGEX;
    private static readonly RIGHT_TO_LEFT_DETECTION_REGEX;
    private static failsafeNumberToLocaleString;
    readonly code: string;
    readonly symbol: string;
    readonly name: string;
    readonly decimals: number;
    readonly locale: string;
    /**
     * This constructor is convenient when manually defining a CurrencyInfo or when no locale is to be specified.
     * @constructor
     * @param {string} currencyCode 3-letter currency code
     * @param {number} [decimals] How many decimal positions the currency has
     * @param {string} [name] The currency's name, e.g. euros
     * @param {string} [symbol] The currency's symbol, e.g. € or CA$
     * @throws If currency code is not a well-formed currency code.
     */ /**
    * This constructor is convenient when the CurrencyInfo's properties are to be automatically determined for a given
    * locale.
    * @constructor
    * @param {string} currencyCode 3-letter currency code
    * @param {string} locale The locale to use for auto-detecting the name and symbol
    * @throws If currency code is not a well-formed currency code.
    */ /**
    * This constructor is convenient when manually defining the locale or some properties of the CurrencyInfo.
    * @constructor
    * @param {string} currencyCode 3-letter currency code
    * @param {Object} [options]
    * @param {number} [options.decimals] How many decimal positions the currency has
    * @param {string} [options.name] The currency's name, e.g. euros
    * @param {string} [options.symbol] The currency's symbol, e.g. € or CA$
    * @param {string} [options.locale] The locale to use when auto-detecting the name or symbol
    * @throws If currency code is not a well-formed currency code.
    */
    constructor(currencyCode: string, decimalsOrLocaleOrOptions?: number, name?: string, symbol?: string);
    constructor(currencyCode: string, decimalsOrLocaleOrOptions: string);
    constructor(currencyCode: string, decimalsOrLocaleOrOptions?: {
        decimals?: number;
        name?: string;
        symbol?: string;
        locale?: string;
    });
}
