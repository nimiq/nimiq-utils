// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger;

class FormattableNumber {
    private static readonly NUMBER_REGEX = /^(-?)(\d*)\.?(\d*)(e(-?\d+))?$/;

    private _allDigits: string;
    private _decimalSeperatorPosition: number;
    private _sign: '' | '-';
    private _exponent: number;

    constructor(value: string | number | bigint | BigInteger) {
        if (typeof value !== 'string') {
            value = value.toString(); // work on strings in any case.
        }
        const numberMatch = value.match(FormattableNumber.NUMBER_REGEX);
        if (!numberMatch) throw new Error(`${value} is not a valid number`);
        this._sign = numberMatch[1] as '' | '-';
        this._allDigits = `${numberMatch[2]}${numberMatch[3]}`;
        this._decimalSeperatorPosition = numberMatch[2].length;
        this._exponent = Number.parseInt(numberMatch[5], 10) || 0;
    }

    public normalize(): FormattableNumber {
        if (!this._exponent) return this;
        this._decimalSeperatorPosition += this._exponent;
        this._exponent = 0;
        if (this._decimalSeperatorPosition > this._allDigits.length) {
            this._allDigits.padEnd(this._decimalSeperatorPosition, '0');
        } else  if (this._decimalSeperatorPosition < 0) {
            this._allDigits.padStart(this._allDigits.length - this._decimalSeperatorPosition, '0');
            this._decimalSeperatorPosition = 0;
        }
        return this;
    }

    public format(
        maxDecimals?: number,
        minDecimals?: number,
        groupSeparator = '\u202F', // thin space (U+202F)
    ): string {
        if (maxDecimals !== undefined && minDecimals !== undefined) {
            minDecimals = Math.min(minDecimals, maxDecimals);
        }
        if (maxDecimals !== undefined && maxDecimals < this._allDigits.length - this._decimalSeperatorPosition) {
            this.round(maxDecimals);
        }
        let integers = this._allDigits.slice(0, this._decimalSeperatorPosition).replace(/^0+/, '');
        let decimals = this._allDigits.slice(this._decimalSeperatorPosition).replace(/0+$/, '');
        if (minDecimals !== undefined && minDecimals > decimals.length) {
            decimals = decimals.padEnd(minDecimals, '0');
        }
        if (groupSeparator && integers.length > 3) {
            integers = integers.replace(/(\d)(?=(\d{3})+$)/g, `$1${groupSeparator}`);
        }
        return `${this._sign}${integers || '0'}${decimals ? `.${decimals}` : ''}${this._exponent !== 0 ? `e${this._exponent}`: ''}`;
    }

    public round(decimals: number): FormattableNumber {
        if (this._exponent) console.warn('rounding a number in scientific notation.');
        if (this._allDigits.length - this._decimalSeperatorPosition <= decimals) return this;
        if (Number.parseInt(this._allDigits[this._decimalSeperatorPosition + decimals]) < 5) {
            this._allDigits = this._allDigits.substring(0, this._decimalSeperatorPosition + decimals);
            return this;
        }
        this._allDigits = `0${this._allDigits}`;
        this._decimalSeperatorPosition += 1;
        let allDigits = this._allDigits.split('');
        for (let i = this._decimalSeperatorPosition + decimals - 1; i >= 0; i--) {
            const newDigit = Number.parseInt(allDigits[i]) + 1;
            if (newDigit === 10) allDigits[i] = '0' // carry on
            else {
                allDigits[i] = newDigit.toString();
                break; // no carry, so break the loop
            }
        }
        this._allDigits = allDigits.join('').substring(0, this._decimalSeperatorPosition + decimals);
        return this;
    }
}

export function formatNumber(
    value: string | number | bigint | BigInteger,
    maxDecimals?: number,
    minDecimals?: number,
    groupSeparator = '\u202F', // thin space (U+202F)
): string {
    return (new FormattableNumber(value)).normalize().format(maxDecimals, minDecimals, groupSeparator);
}

export function toNonScientificNumberString(
    value: string | number | bigint | BigInteger,
): string {
    return (new FormattableNumber(value)).normalize().format();
}

/* likely not needed, as formatNumber does it already */
export function round(
    value: string | number | bigint | BigInteger,
    decimals: number,
): string {
    return (new FormattableNumber(value)).normalize().round(decimals).format(decimals, decimals);
}
