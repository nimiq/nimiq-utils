export class CurrencyInfo {
    // This is a manually curated list which was created mainly from
    // https://en.wikipedia.org/wiki/List_of_circulating_currencies with help of the following script run
    // on that wikipedia page. Note that we don't just use the ISO 4217 list of currency codes directly, as
    // it includes some additional codes which are not actual fiat currency codes (see
    // https://en.wikipedia.org/wiki/ISO_4217#X_currencies). Also note that there are also already nicely
    // parsable npm packages like https://github.com/bengourley/currency-symbol-map/blob/master/map.js
    // or https://github.com/smirzaei/currency-formatter/blob/master/currencies.json. However, they both
    // seem to be less accurate than the Wikipedia article (see e.g. KGS), missing some currencies (e.g. MRU)
    // and contain some non-fiat currencies like crypto currencies. When unsure about a currency sign, also
    // consult https://en.wikipedia.org/wiki/Currency_symbol#List_of_currency_symbols_currently_in_use.
    //
    // const EXTRA_SYMBOLS = {
    //     as defined below
    // };
    //
    // function parseWikipediaCurrencyList() {
    //     const sectionHeadline = document.querySelector('#List_of_circulating_currencies_by_state_or_territory')
    //         .closest('h2');
    //     const table = ((el) => {
    //         while (el.tagName !== 'TABLE') el = el.nextElementSibling;
    //         return el;
    //     })(sectionHeadline);
    //
    //     const currencySymbols = {};
    //
    //     for (const row of table.querySelectorAll('tbody tr')) {
    //         // count columns from the end because not all rows have the same number of columns as on some rows, the
    //         // first column is omitted if the cell in the first column of a previous row spans multiple rows.
    //         const code = row.children[row.childElementCount - 3].textContent.trim();
    //         if (code.includes('[G]') // an inofficial currency code not registered in ISO 4217
    //             || code.includes('none')
    //         ) continue;
    //         const symbols = row.children[row.childElementCount - 4].textContent.trim()
    //             .replace(/\[.+]/g, '') // remove comments
    //             .split(/ or |, /);
    //         if (symbols.length === 1 && symbols[0].includes('none')) continue;
    //
    //         var entry = currencySymbols[code] || [];
    //         symbols.forEach((symbol) => {
    //             if (!entry.includes(symbol)) entry.push(symbol);
    //         });
    //         currencySymbols[code] = entry;
    //     }
    //
    //     return currencySymbols;
    // }
    //
    // // simplified from CurrencyInfo and removed checking for navigator.language to remove the dependency of this code
    // // snippet from the tester's browser language.
    // function getBrowserCurrencySymbol(currencyCode) {
    //     const currencyCountry = currencyCode.substring(0, 2);
    //
    //     const [locale] = Intl.NumberFormat.supportedLocalesOf([ // also normalizes the locales
    //         `en-${currencyCountry}`, // English as spoken in currency country
    //         'en-US', // en-US as last resort
    //     ]);
    //     const formatterOptions = {
    //         style: 'currency',
    //         currency: currencyCode,
    //         useGrouping: false,
    //         numberingSystem: 'latn',
    //     };
    //
    //     let formattedString = (0).toLocaleString(
    //         locale,
    //         { currencyDisplay: 'narrowSymbol', ...formatterOptions },
    //     );
    //
    //     return formattedString.replace(/\d+(?:\D(\d+))?/, '').trim();
    // }
    //
    // function isRightToLeft(s){
    //     return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(s);
    // };
    //
    // const referenceCurrencySymbols = parseWikipediaCurrencyList();
    // for (const currency of Object.keys(referenceCurrencySymbols).sort()) {
    //     const referenceSymbols = referenceCurrencySymbols[currency];
    //     const extraSymbols = !EXTRA_SYMBOLS[currency]
    //         ? []
    //         : Array.isArray(EXTRA_SYMBOLS[currency])
    //             ? EXTRA_SYMBOLS[currency]
    //             : [EXTRA_SYMBOLS[currency]];
    //     const browserSymbol = getBrowserCurrencySymbol(currency);
    //
    //     if (extraSymbols.length) {
    //         if (referenceSymbols.includes(browserSymbol) && !isRightToLeft(browserSymbol)) {
    //             console.warn(`${currency}: potentially unnecessary definition in EXTRA_SYMBOLS. `
    //                 + `Reference symbols are ${referenceSymbols}; extra symbols are ${extraSymbols}; `
    //                 + `browser symbol is ${browserSymbol}.`);
    //         } else {
    //             console.info(`${currency}: manually defined via EXTRA_SYMBOLS. `
    //                 + `Reference symbols are ${referenceSymbols}; extra symbols are ${extraSymbols}; `
    //                 + `browser symbol is ${browserSymbol}.`);
    //         }
    //
    //         if (!extraSymbols.some((symbol) => referenceSymbols.includes(symbol))) {
    //             console.warn(`${currency}: mismatch between reference symbols and EXTRA_SYMBOLS. `
    //                 + `Reference symbols are ${referenceSymbols}; extra symbols are ${extraSymbols}; `
    //                 + `browser symbol is ${browserSymbol}.`);
    //         }
    //     } else {
    //         if (!referenceSymbols.includes(browserSymbol) && browserSymbol === currency) {
    //             console.warn(`${currency}: missing in EXTRA_SYMBOLS. `
    //                 + `Reference symbols are ${referenceSymbols}; browser symbol is ${browserSymbol}. `
    //                 + `Add as ${currency}: ${referenceSymbols.length > 1
    //                     ? `['${referenceSymbols.join(`', '`)}']`
    //                     : `'${referenceSymbols}'`},`);
    //         } else {
    //             console.info(`${currency}: Saved explicit definition of extra symbol.  `
    //                 + `Reference symbols are ${referenceSymbols}; `
    //                 + `browser symbol is ${browserSymbol}.`);
    //         }
    //
    //         if (isRightToLeft(browserSymbol)) {
    //             console.warn(`${currency}: browser symbol is right to left. `
    //                 + `Reference symbols are ${referenceSymbols}; extra symbols are ${extraSymbols}; `
    //                 + `browser symbol is ${browserSymbol}.`);
    //         }
    //     }
    // }
    private static readonly EXTRA_SYMBOLS: {[code: string]: string | [string, string]} = {
        AED: ['DH', 'د.إ'],
        AFN: ['Afs', '؋'],
        ALL: 'L',
        ANG: 'ƒ',
        AWG: 'ƒ',
        BGN: 'лв.',
        BHD: ['BD', '.د.ب'],
        BTN: 'Nu.',
        BYN: 'Br',
        CDF: 'Fr',
        CHF: 'Fr.',
        CVE: '$',
        DJF: 'Fr',
        DZD: ['DA', 'د.ج'],
        EGP: ['£', 'ج.م'],
        ETB: 'Br',
        HTG: 'G',
        IQD: ['ID', 'ع.د'],
        IRR: ['RI', '﷼'],
        JOD: ['JD', 'د.ا'],
        KES: 'Sh',
        KGS: '\u20c0', // new unicode char to be released Sep 2021
        KWD: ['KD', 'د.ك'],
        LBP: ['LL', 'ل.ل'],
        LSL: 'M', // mismatch to Wikipedia's L because M is used for plural
        LYD: ['LD', 'ل.د'],
        MAD: ['DH', 'درهم'], // mismatch to Wikipedia as the actual wiki article shows different symbols, also in Arabic
        MDL: 'L',
        MKD: 'ден',
        MMK: 'Ks', // Ks for plural
        MRU: 'UM',
        MVR: ['Rf', '.ރ'],
        MZN: 'MT',
        NPR: 'रु', // mismatch to Wikipedia as actual wiki article shows it as रु, also in Nepali
        OMR: ['R.O.', 'ر.ع.'],
        PAB: 'B/.',
        PEN: 'S/', // mismatch to Wikipedia as actual wiki article shows it as S/, also in Spanish
        PKR: '₨',
        QAR: ['QR', 'ر.ق'],
        RSD: 'дин.',
        SAR: ['SR', '﷼'],
        SDG: ['£SD', 'ج.س.'],
        SOS: 'Sh.',
        TJS: 'SM', // mismatch to Wikipedia as actual wiki article shows it as SM
        TMT: 'm', // mismatch to Wikipedia as actual wiki article shows it as m
        TND: ['DT', 'د.ت'],
        UZS: 'сум', // mismatch to Wikipedia as actual wiki article shows it as сум
        VES: 'Bs.',
        WST: 'T',
        XPF: '₣',
        YER: ['RI', '﷼'],
    };

    // Some currencies have been devalued so much by inflation that their sub-units have been removed from circulation
    // or are effectively not being used anymore. This is not for all currencies reflected yet in toLocaleString, such
    // that we mark some currencies manually as decimal-less. This list has been assembled manually from the list of all
    // circulating currencies (https://en.wikipedia.org/wiki/List_of_circulating_currencies) by first reducing it to
    // currencies that still have decimals via the following script, and then looking through their Wikipedia articles.
    //
    // const referenceCurrencySymbols = parseWikipediaCurrencyList(); // as defined above
    // for (const currency of Object.keys(referenceCurrencySymbols).sort()) {
    //     const country = currency.substring(0, 2);
    //     const formatted = (2).toLocaleString([`en-${country}`], {
    //         style: 'currency',
    //         currency: currency,
    //         currencyDisplay: 'narrowSymbol',
    //         numberingSystem: 'latn',
    //     });
    //     const numberMatch = formatted.match(/\d+(?:\D(\d+))?/);
    //     const decimals = numberMatch ? (numberMatch[1] || '').length : 2;
    //     if (!decimals) continue;
    //     console.log(`${currency} - ${decimals}\n`);
    // }
    private static readonly CUSTOM_DECIMAL_LESS_CURRENCIES = new Set([
        'AMD', // sub-unit rarely used
        'AOA', // sub-unit rarely used
        'ARS', // sub-unit discontinued
        'BDT', // sub-unit discontinued
        'BTN', // sub-unit rarely used
        'CDF', // sub-unit rarely used
        'COP', // sub-unit rarely used
        'CRC', // sub-unit discontinued
        'CVE', // sub-unit discontinued
        'CZK', // sub-unit discontinued
        'DOP', // sub-unit rarely used
        'DZD', // sub-unit discontinued
        'GMD', // sub-unit discontinued
        'GYD', // sub-unit discontinued
        'HUF', // sub-unit discontinued
        'IDR', // sub-unit discontinued
        'INR', // sub-unit discontinued
        'JMD', // sub-unit discontinued
        'KES', // sub-unit rarely used
        'KGS', // sub-unit rarely used
        'KHR', // sub-unit discontinued
        'KZT', // sub-unit rarely used
        'LKR', // sub-unit discontinued
        'MAD', // sub-unit rarely used
        'MKD', // sub-unit discontinued
        'MNT', // sub-unit discontinued
        'MOP', // sub-unit discontinued
        'MWK', // sub-unit rarely used
        'MXN', // sub-unit rarely used
        'NGN', // sub-unit rarely used
        'NOK', // sub-unit discontinued
        'NPR', // sub-unit rarely used
        'PHP', // sub-unit rarely used
        'PKR', // sub-unit discontinued
        'RUB', // sub-unit rarely used
        'SEK', // sub-unit discontinued
        'TWD', // sub-unit discontinued
        'TZS', // sub-unit discontinued
        'UAH', // sub-unit discontinued
        'UYU', // sub-unit discontinued
        'UZS', // sub-unit discontinued
        'VES', // sub-unit rarely used
    ]);

    // Cache auto-generated CurrencyInfos such that they do not need to be recalculated.
    private static readonly CACHED_AUTO_GENERATED_CURRENCY_INFOS: { [currencyAndLocale: string]: CurrencyInfo } = {};

    // Regex for detecting the number with optional decimals in a formatted string for useGrouping: false
    private static readonly NUMBER_REGEX = /\d+(?:\D(\d+))?/;
    // Simplified and adapted from https://stackoverflow.com/a/14824756.
    // Note that this rtl detection is incomplete but good enough for our needs.
    private static readonly RIGHT_TO_LEFT_DETECTION_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

    public readonly code: string;
    public readonly symbol!: string;
    public readonly name!: string;
    public readonly decimals!: number;
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
        const currencyCountry = this.code.substring(0, 2);

        [this.locale] = Intl.NumberFormat.supportedLocalesOf([ // also normalizes the locales
            ...(locale ? [locale] : []), // try requested locale
            `${navigator.language.substring(0, 2)}-${currencyCountry}`, // user language as spoken in currency country
            navigator.language, // fallback
            'en-US', // en-US as last resort
        ]);

        const isAutoGenerated = decimals === undefined && name === undefined && symbol === undefined;
        const cacheKey = `${this.code} ${this.locale}`;
        const cachedCurrencyInfo = CurrencyInfo.CACHED_AUTO_GENERATED_CURRENCY_INFOS[cacheKey];
        if (isAutoGenerated && cachedCurrencyInfo) {
            return cachedCurrencyInfo;
        }

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
        } else if (cachedCurrencyInfo) {
            this.decimals = cachedCurrencyInfo.decimals;
        } else if (CurrencyInfo.CUSTOM_DECIMAL_LESS_CURRENCIES.has(this.code)) {
            this.decimals = 0;
        } else {
            const numberMatch = formattedString.match(CurrencyInfo.NUMBER_REGEX);
            this.decimals = numberMatch ? (numberMatch[1] || '').length : 2;
        }

        if (name !== undefined) {
            this.name = name;
        } else if (cachedCurrencyInfo) {
            this.name = cachedCurrencyInfo.name;
        } else {
            this.name = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
        }

        if (symbol !== undefined) {
            this.symbol = symbol;
        } else if (cachedCurrencyInfo) {
            this.symbol = cachedCurrencyInfo.symbol;
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
                    // Unless a locale was specifically requested, use `en-${currencyCountry}` for the symbol detection
                    // instead of this.locale which is based on navigator.language, as the EXTRA_SYMBOLS have been
                    // created based on en.
                    [
                        ...(locale ? [locale] : []), // try requested locale
                        `en-${currencyCountry}`,
                        'en',
                    ],
                    { currencyDisplay: 'narrowSymbol', ...formatterOptions },
                );
                this.symbol = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
            }
        }

        if (isAutoGenerated) {
            CurrencyInfo.CACHED_AUTO_GENERATED_CURRENCY_INFOS[cacheKey] = this;
        }
    }
    /* eslint-enable no-dupe-class-members, lines-between-class-members */
}
