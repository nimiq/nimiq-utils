'use strict';

class CurrencyInfo {
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
    static EXTRA_SYMBOLS = {
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
        KGS: '\u20c0',
        KWD: ['KD', 'د.ك'],
        LBP: ['LL', 'ل.ل'],
        LSL: 'M',
        LYD: ['LD', 'ل.د'],
        MAD: ['DH', 'درهم'],
        MDL: 'L',
        MKD: 'ден',
        MMK: 'Ks',
        MRU: 'UM',
        MVR: ['Rf', '.ރ'],
        MZN: 'MT',
        NPR: 'रु',
        OMR: ['R.O.', 'ر.ع.'],
        PAB: 'B/.',
        PEN: 'S/',
        PKR: '₨',
        QAR: ['QR', 'ر.ق'],
        RSD: 'дин.',
        SAR: ['SR', '﷼'],
        SDG: ['£SD', 'ج.س.'],
        SOS: 'Sh.',
        TJS: 'SM',
        TMT: 'm',
        TND: ['DT', 'د.ت'],
        UZS: 'сум',
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
    static CUSTOM_DECIMAL_LESS_CURRENCIES = new Set([
        'AMD',
        'AOA',
        'ARS',
        'BDT',
        'BTN',
        'CDF',
        'COP',
        'CRC',
        'CVE',
        'CZK',
        'DOP',
        'DZD',
        'GMD',
        'GYD',
        'HUF',
        'IDR',
        'INR',
        'JMD',
        'KES',
        'KGS',
        'KHR',
        'KZT',
        'LKR',
        'MAD',
        'MKD',
        'MNT',
        'MOP',
        'MWK',
        'MXN',
        'NGN',
        'NOK',
        'NPR',
        'PHP',
        'PKR',
        'RUB',
        'SEK',
        'TWD',
        'TZS',
        'UAH',
        'UYU',
        'UZS',
        'VES', // sub-unit rarely used
    ]);
    // Cache auto-generated CurrencyInfos such that they do not need to be recalculated.
    static CACHED_AUTO_GENERATED_CURRENCY_INFOS = {};
    // Regex for detecting valid currency codes.
    static CURRENCY_CODE_REGEX = /[A-Z]{3}/i;
    // Regex for detecting the number with optional decimals in a formatted string for useGrouping: false
    static NUMBER_REGEX = /\d+(?:\D(\d+))?/;
    // Simplified and adapted from https://stackoverflow.com/a/14824756.
    // Note that this rtl detection is incomplete but good enough for our needs.
    static RIGHT_TO_LEFT_DETECTION_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    static failsafeNumberToLocaleString(value, locales, options) {
        try {
            // toLocaleString can fail for example for invalid locales or currency codes or unsupported currencyDisplay
            // options in older browsers. Older Chrome versions also had a bug, where some option combinations lead to
            // a "Internal error. Icu error." exception.
            return value.toLocaleString(locales, options);
        }
        catch (e) {
            return null;
        }
    }
    code;
    symbol;
    name;
    decimals;
    locale;
    constructor(currencyCode, decimalsOrLocaleOrOptions, name, symbol) {
        if (!CurrencyInfo.CURRENCY_CODE_REGEX.test(currencyCode)) {
            throw new Error(`Invalid currency code ${currencyCode}`);
        }
        let decimals;
        let locale;
        if (typeof decimalsOrLocaleOrOptions === 'number') {
            decimals = decimalsOrLocaleOrOptions;
        }
        else if (typeof decimalsOrLocaleOrOptions === 'string') {
            locale = decimalsOrLocaleOrOptions;
        }
        else if (typeof decimalsOrLocaleOrOptions === 'object') {
            ({ decimals, name, symbol, locale } = decimalsOrLocaleOrOptions);
        }
        this.code = currencyCode.toUpperCase();
        // Get the country from the currency code which is typically (but not necessarily) the first two letters,
        // see https://en.wikipedia.org/wiki/ISO_4217#National_currencies.
        const currencyCountry = this.code.substring(0, 2);
        const nameLocalesToTry = [
            ...(locale ? [locale] : []),
            `${navigator.language.substring(0, 2)}-${currencyCountry}`,
            navigator.language,
            'en-US', // en-US as last resort
        ];
        let supportsDisplayNames = 'DisplayNames' in Intl;
        // also normalizes the locales
        [this.locale] = supportsDisplayNames
            // @ts-ignore TODO use proper types once https://github.com/microsoft/TypeScript/pull/44022 is available
            ? Intl.DisplayNames.supportedLocalesOf(nameLocalesToTry)
            : Intl.NumberFormat.supportedLocalesOf(nameLocalesToTry);
        if (supportsDisplayNames && !this.locale) {
            // DisplayNames does not support any of the tried locales, not even en. This can happen especially if
            // DisplayNames was polyfilled, e.g. by @formatjs/intl-displaynames, but no data was (lazy)loaded for any
            // of our locales.
            supportsDisplayNames = false;
            [this.locale] = Intl.NumberFormat.supportedLocalesOf(nameLocalesToTry);
        }
        const isAutoGenerated = decimals === undefined && name === undefined && symbol === undefined;
        const cacheKey = `${this.code} ${this.locale}`;
        const cachedCurrencyInfo = CurrencyInfo.CACHED_AUTO_GENERATED_CURRENCY_INFOS[cacheKey];
        if (isAutoGenerated && cachedCurrencyInfo) {
            return cachedCurrencyInfo; // eslint-disable-line no-constructor-return
        }
        let formattedString;
        const formatterOptions = {
            style: 'currency',
            currency: currencyCode,
            useGrouping: false,
            numberingSystem: 'latn',
        };
        if (name !== undefined) {
            this.name = name;
        }
        else if (cachedCurrencyInfo) {
            this.name = cachedCurrencyInfo.name;
        }
        else if (supportsDisplayNames) {
            try {
                // Use DisplayNames if available as it provides better names.
                // @ts-ignore TODO use proper types once https://github.com/microsoft/TypeScript/pull/44022 is merged
                this.name = new Intl.DisplayNames(this.locale, { type: 'currency' }).of(currencyCode);
            }
            catch (e) {
                // Ignore and continue with if block below.
            }
        }
        if (!this.name) {
            formattedString = CurrencyInfo.failsafeNumberToLocaleString(0, this.locale, { currencyDisplay: 'name', ...formatterOptions });
            this.name = formattedString
                // Using regex parsing instead of NumberFormat.formatToParts which has less browser support.
                ? formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim()
                : this.code;
        }
        if (symbol !== undefined) {
            this.symbol = symbol;
        }
        else if (cachedCurrencyInfo) {
            this.symbol = cachedCurrencyInfo.symbol;
        }
        else {
            const extraSymbol = CurrencyInfo.EXTRA_SYMBOLS[this.code];
            if (typeof extraSymbol === 'string') {
                this.symbol = extraSymbol;
            }
            else if (Array.isArray(extraSymbol)) {
                // Use right-to-left currency symbols only if a right-to-left locale was used and explicitly requested.
                const useRightToLeft = this.locale === locale
                    && CurrencyInfo.RIGHT_TO_LEFT_DETECTION_REGEX.test(this.name);
                this.symbol = extraSymbol[useRightToLeft ? 1 : 0];
            }
            else {
                // Unless a locale was specifically requested, use `en-${currencyCountry}` for the symbol detection
                // instead of this.locale which is based on navigator.language, as the EXTRA_SYMBOLS have been
                // created based on en.
                const symbolLocalesToTry = [
                    ...(locale ? [locale] : []),
                    `en-${currencyCountry}`,
                    'en',
                ];
                const symbolFormattedString = CurrencyInfo.failsafeNumberToLocaleString(0, symbolLocalesToTry, { currencyDisplay: 'narrowSymbol', ...formatterOptions }) || CurrencyInfo.failsafeNumberToLocaleString(0, symbolLocalesToTry, { currencyDisplay: 'symbol', ...formatterOptions });
                if (symbolFormattedString) {
                    formattedString = symbolFormattedString;
                    this.symbol = formattedString.replace(CurrencyInfo.NUMBER_REGEX, '').trim();
                }
                else {
                    this.symbol = this.code;
                }
            }
        }
        if (decimals !== undefined) {
            this.decimals = decimals;
        }
        else if (cachedCurrencyInfo) {
            this.decimals = cachedCurrencyInfo.decimals;
        }
        else if (CurrencyInfo.CUSTOM_DECIMAL_LESS_CURRENCIES.has(this.code)) {
            this.decimals = 0;
        }
        else {
            // As we only need the number, the used locale and currencyDisplay don't matter.
            formattedString = formattedString || CurrencyInfo.failsafeNumberToLocaleString(0, 'en', { currencyDisplay: 'code', ...formatterOptions });
            if (formattedString) {
                const numberMatch = formattedString.match(CurrencyInfo.NUMBER_REGEX);
                this.decimals = numberMatch ? (numberMatch[1] || '').length : 2;
            }
            else {
                this.decimals = 2;
            }
        }
        if (isAutoGenerated) {
            CurrencyInfo.CACHED_AUTO_GENERATED_CURRENCY_INFOS[cacheKey] = this;
        }
    }
}

exports.CurrencyInfo = CurrencyInfo;
//# sourceMappingURL=CurrencyInfo.js.map
