export class CurrencyInfo {
    private static readonly EXTRA_SYMBOLS: {[code: string]: string | [string, string]} = {
        AED: ['DH', 'د.إ'],
        ARS: '$',
        BDT: '৳',
        BHD: ['BD', '.د.ب'],
        BMD: '$',
        CHF: 'Fr.', // also CHf or SFr.
        CLP: '$',
        CZK: 'Kč',
        DKK: 'Kr.',
        HUF: 'Ft',
        IDR: 'Rp',
        KWD: ['KD', 'د.ك'],
        LKR: 'Rs', // also ரூ or රු
        MMK: 'K',
        MYR: 'RM',
        NOK: 'kr',
        PHP: '₱',
        PKR: '₨',
        PLN: 'zł',
        RUB: '₽',
        SAR: ['SR', '﷼'],
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
    // Simplified and adapted from https://stackoverflow.com/a/14824756.
    // Note that this rtl detection is incomplete but good enough for our needs.
    private static readonly RIGHT_TO_LEFT_DETECTION_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

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

        this.code = currencyCode.toUpperCase();

        // Get the country from the currency code which is typically (but not necessarily) the first two letters,
        // see https://en.wikipedia.org/wiki/ISO_4217#National_currencies.
        const currencyCountry = currencyCode.substring(0, 2);

        [this.locale] = Intl.NumberFormat.supportedLocalesOf([ // also normalizes the locales
            ...(locale ? [locale] : []), // try requested locale
            currencyCountry, // test whether the country code coincides with a language code
            `${navigator.language.substring(0, 2)}-${currencyCountry}`, // user language as spoken in currency country
            navigator.language, // fallback
            'en-US', // en-US as last resort
        ]);
        const formatterOptions = {
            style: 'currency',
            currency: currencyCode, // without toUpperCase to avoid conversion of characters, e.g. Eszett to SS
            useGrouping: false,
            numberingSystem: 'latn',
        };

        // Note that toLocaleString throws for not well-formatted currency codes
        // (see https://www.ecma-international.org/ecma-402/1.0/#sec-6.3.1).
        // Using regex parsing instead of NumberFormat.formatToParts which has less browser support.
        let formattedString = (0).toLocaleString(
            this.locale,
            { currencyDisplay: 'name', ...formatterOptions },
        );

        if (decimals !== undefined) {
            this.decimals = decimals;
        } else {
            const numberMatch = formattedString.match(CurrencyInfo.NUMBER_REGEX);
            this.decimals = numberMatch ? (numberMatch[1] || '').length : 2;
        }

        if (name !== undefined) {
            this.name = name;
        } else {
            this.name = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
        }

        if (symbol !== undefined) {
            this.symbol = symbol;
        } else {
            const extraSymbol = CurrencyInfo.EXTRA_SYMBOLS[this.code];
            if (typeof extraSymbol === 'string') {
                this.symbol = extraSymbol;
            } else if (Array.isArray(extraSymbol)) {
                // Use right-to-left currency symbols only if a right-to-left locale was used and explicitly requested.
                const useRightToLeft = this.locale === locale
                    && CurrencyInfo.RIGHT_TO_LEFT_DETECTION_REGEX.test(this.name);
                this.symbol = extraSymbol[useRightToLeft ? 1 : 0];
            } else {
                formattedString = (0).toLocaleString(
                    this.locale,
                    { currencyDisplay: 'symbol', ...formatterOptions },
                );
                this.symbol = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
            }
        }
    }
    /* eslint-enable no-dupe-class-members, lines-between-class-members */
}
