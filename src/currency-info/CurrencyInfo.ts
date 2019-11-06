export class CurrencyInfo {
    // Regex for en-US formatted currency strings (supporting both currency symbol and currency name)
    private static readonly NUMBER_FORMAT_REGEX = new RegExp(
        '^'
        + '([^\\d\\s]+)?' // currency symbol in front of number
        + '\\s?' // Potential whitespace. en-US adds a whitespace for example in 'XYZ 1.00' but not in 'CA$1.00'
        + '\\d+' // integer part with useGrouping: false
        + '(?:\\D(\\d+))?' // fractional part, can be empty
        + '(?:\\s(.+))?'// currency name after number
        + '$'
    );

    public readonly code: string;
    public readonly symbol: string;
    public readonly name: string;
    public readonly decimals: number;

    /**
     * @param {string} currencyCode 3-letter currency code
     * @param {number} [decimals] How many decimal positions the currency has
     * @param {string} [name] The currency's name, e.g. euros
     * @param {string} [symbol] The currency's symbol, e.g. € or CA$
     * @throws If currency code is not a well-formed currency code.
     */
    constructor(currencyCode: string, decimals?: number, name?: string, symbol?: string) {
        const formatterOptions = {
            style: 'currency',
            currency: currencyCode, // before toUpperCase to avoid conversion of characters, e.g. Eszett to SS
            useGrouping: false,
        };
        this.code = currencyCode.toUpperCase();
        // Note that toLocaleString throws for not well-formatted currency codes
        // (see https://www.ecma-international.org/ecma-402/1.0/#sec-6.3.1).
        // Using regex parsing instead of NumberFormat.formatToParts which has less browser support.
        let regexMatch = (0).toLocaleString(
            'en-US',
            Object.assign({ currencyDisplay: 'symbol' } , formatterOptions)
        ).match(CurrencyInfo.NUMBER_FORMAT_REGEX);
        this.decimals = decimals !== undefined
            ? decimals
            : regexMatch ? (regexMatch[2] || '').length : 2;
        this.symbol = symbol !== undefined
            ? symbol
            : regexMatch ? regexMatch[1] || this.code : this.code;

        if (name !== undefined) {
            this.name = name;
            return;
        }
        regexMatch = (0).toLocaleString(
            'en-US',
            Object.assign({ currencyDisplay: 'name' } , formatterOptions)
        ).match(CurrencyInfo.NUMBER_FORMAT_REGEX);
        this.name = regexMatch ? regexMatch[3] || this.code : this.code;
    }
}
