export class CurrencyInfo {
    private static readonly EXTRA_SYMBOLS: {[code: string]: string} = {
        AED: 'د.إ', // also DH or Dhs.
        ARS: '$',
        BDT: '৳',
        BHD: 'BD', // also .د.ب (left-to-right)
        BMD: '$',
        CHF: 'Fr.', // also CHf or SFr.
        CLP: '$',
        CZK: 'Kč',
        DKK: 'Kr.',
        HUF: 'Ft',
        IDR: 'Rp',
        KWD: 'KD', // also د.ك (left-to-right)
        LKR: 'Rs', // also ரூ or රු
        MMK: 'K',
        MYR: 'RM',
        NOK: 'kr',
        PHP: '₱',
        PKR: '₨',
        PLN: 'zł',
        RUB: '₽',
        SAR: 'SR', // also ر.س or ﷼‎ (both left-to-right)
        SEK: 'kr',
        SGD: 'S$', // also $
        THB: '฿',
        TRY: '₺',
        UAH: '₴',
        VEF: 'Bs', // also Bs.F.
        ZAR: 'R',
    };

    // Regex for detecting the number with optional decimals in a formatted string for useGrouping: false
    private static readonly NUMBER_REGEX = /\d+(?:\D(\d+))?/;

    public readonly code: string;
    public readonly symbol: string;
    public readonly name: string;
    public readonly decimals: number;
    public readonly locale: string;

    /* eslint-disable no-dupe-class-members, lines-between-class-members */
    /**
     * This constructor is convenient when manually defining a CurrencyInfo or when no locale is to be specified.
     * @constructor
     * @param {string} currencyCode 3-letter currency code
     * @param {number} [decimals] How many decimal positions the currency has
     * @param {string} [name] The currency's name, e.g. euros
     * @param {string} [symbol] The currency's symbol, e.g. € or CA$
     * @throws If currency code is not a well-formed currency code.
     *//**
     * This constructor is convenient when the CurrencyInfo's properties are to be automatically determined for a given
     * locale.
     * @constructor
     * @param {string} currencyCode 3-letter currency code
     * @param {string} locale The locale to use for auto-detecting the name and symbol
     * @throws If currency code is not a well-formed currency code.
     *//**
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
    constructor(
        currencyCode: string,
        decimalsOrLocaleOrOptions?: { decimals?: number, name?: string, symbol?: string, locale?: string },
    );
    constructor(
        currencyCode: string,
        decimalsOrLocaleOrOptions?: number | string
            | { decimals?: number, name?: string, symbol?: string, locale?: string },
        name?: string,
        symbol?: string,
    ) {
        let decimals: number | undefined;
        let locale: string | undefined;

        if (typeof decimalsOrLocaleOrOptions === 'number') {
            decimals = decimalsOrLocaleOrOptions;
        } else if (typeof decimalsOrLocaleOrOptions === 'string') {
            locale = decimalsOrLocaleOrOptions;
        } else if (typeof decimalsOrLocaleOrOptions === 'object') {
            ({ decimals, name, symbol, locale } = decimalsOrLocaleOrOptions);
        }

        // Get the country from the currency code which is typically (but not necessarily) the first two letters,
        // see https://en.wikipedia.org/wiki/ISO_4217#National_currencies.
        const currencyCountry = currencyCode.substring(0, 2);

        [locale] = Intl.NumberFormat.supportedLocalesOf([ // also normalizes the locales
            ...(locale ? [locale] : []), // try user provided locale
            currencyCountry, // test whether the country code coincides with a language code
            `${navigator.language.substring(0, 2)}-${currencyCountry}`, // user language as spoken in currency country
            navigator.language, // fallback
            'en-US', // en-US as last resort
        ]);
        const formatterOptions = {
            style: 'currency',
            currency: currencyCode, // before toUpperCase to avoid conversion of characters, e.g. Eszett to SS
            useGrouping: false,
            numberingSystem: 'latn',
        };

        // Note that toLocaleString throws for not well-formatted currency codes
        // (see https://www.ecma-international.org/ecma-402/1.0/#sec-6.3.1).
        // Using regex parsing instead of NumberFormat.formatToParts which has less browser support.
        let formattedString = (0).toLocaleString(
            locale,
            { currencyDisplay: 'symbol', ...formatterOptions },
        );

        this.locale = locale;
        this.code = currencyCode.toUpperCase();

        if (decimals !== undefined) {
            this.decimals = decimals;
        } else {
            const numberMatch = formattedString.match(CurrencyInfo.NUMBER_REGEX);
            this.decimals = numberMatch ? (numberMatch[1] || '').length : 2;
        }

        if (symbol !== undefined) {
            this.symbol = symbol;
        } else {
            this.symbol = CurrencyInfo.EXTRA_SYMBOLS[this.code]
                || formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
        }

        if (name !== undefined) {
            this.name = name;
        } else {
            formattedString = (0).toLocaleString(
                locale,
                { currencyDisplay: 'name', ...formatterOptions },
            );
            this.name = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
        }
    }
    /* eslint-enable no-dupe-class-members, lines-between-class-members */
}
