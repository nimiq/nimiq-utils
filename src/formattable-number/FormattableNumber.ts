// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger;

// formats and converts numbers without precision loss
export class FormattableNumber {
    private static readonly NUMBER_REGEX = /^(-?)(\d*)\.?(\d*)(e(-?\d+))?$/;

    private _digits: string;
    private _decimalSeparatorPosition: number;
    private _sign: '' | '-';

    constructor(value: string | number | bigint | BigInteger) {
        if (typeof value !== 'string') {
            value = value.toString(); // work on strings in any case. Note that this might result in scientific notation
        }
        const numberMatch = value.match(FormattableNumber.NUMBER_REGEX);
        if (!numberMatch) throw new Error(`${value} is not a valid number`);
        this._sign = numberMatch[1] as '' | '-';
        this._digits = `${numberMatch[2]}${numberMatch[3]}`;
        if (!this._digits) throw new Error(`${value} is not a valid number`);
        this._decimalSeparatorPosition = numberMatch[2].length;

        const exponent = Number.parseInt(numberMatch[5], 10);
        if (exponent) this.moveDecimalSeparator(exponent); // remove scientific notation
    }

    public toString(optionsOrUseGrouping?: {
        maxDecimals?: number,
        minDecimals?: number,
        useGrouping?: boolean, // defaults to false
        groupSeparator?: string, // defaults to thin space (U+202F)
    } | boolean) : string {
        let {
            maxDecimals = undefined,
            minDecimals = undefined,
            useGrouping = optionsOrUseGrouping === true,
            groupSeparator = '\u202F',
        } = typeof optionsOrUseGrouping === 'object' ? optionsOrUseGrouping : {};
        if (maxDecimals !== undefined && minDecimals !== undefined) {
            minDecimals = Math.min(minDecimals, maxDecimals);
        }
        if (maxDecimals !== undefined && maxDecimals < this._digits.length - this._decimalSeparatorPosition) {
            this.round(maxDecimals);
        }
        let integers = this._digits.slice(0, this._decimalSeparatorPosition).replace(/^0+/, ''); // trim leading 0s
        let decimals = this._digits.slice(this._decimalSeparatorPosition).replace(/0+$/, ''); // trim trailing 0s
        if (minDecimals !== undefined && minDecimals > decimals.length) {
            decimals = decimals.padEnd(minDecimals, '0');
        }

        // Apply grouping for values with more than 4 integer digits.
        if (useGrouping && groupSeparator && integers.length > 4) {
            integers = integers.replace(/(\d)(?=(\d{3})+$)/g, `$1${groupSeparator}`);
        }
        return `${this._sign}${integers || '0'}${decimals ? `.${decimals}` : ''}`;
    }

    public valueOf() {
        return this.toString();
    }

    public moveDecimalSeparator(moveBy: number): this {
        this._decimalSeparatorPosition += moveBy;
        if (this._decimalSeparatorPosition > this._digits.length) {
            this._digits = this._digits.padEnd(this._decimalSeparatorPosition, '0');
        } else if (this._decimalSeparatorPosition < 0) {
            this._digits = this._digits.padStart(this._digits.length - this._decimalSeparatorPosition, '0');
            this._decimalSeparatorPosition = 0;
        }
        return this;
    }

    public round(decimals: number): this {
        if (this._digits.length - this._decimalSeparatorPosition <= decimals) return this;
        const digitsToKeep = this._digits.substring(0, this._decimalSeparatorPosition + decimals);
        if (Number.parseInt(this._digits[this._decimalSeparatorPosition + decimals], 10) < 5) {
            // rounding down, can just use the trimmed decimals
            this._digits = digitsToKeep;
            return this;
        }

        // round up
        const digits = `0${digitsToKeep}`.split(''); // add a leading 0 for easier handling of carry
        for (let i = digits.length - 1; i >= 0; --i) {
            const newDigit = Number.parseInt(digits[i], 10) + 1;
            if (newDigit < 10) {
                digits[i] = newDigit.toString();
                break; // no carry over, break
            } else {
                digits[i] = '0';
                // continue loop to handle carry over
            }
        }
        this._digits = digits.join('');
        this._decimalSeparatorPosition += 1; // account for the added leading 0
        return this;
    }

    public equals(other: any) {
        if (!(other instanceof FormattableNumber)) {
            try {
                other = new FormattableNumber(other);
            } catch (e) {
                // not convertable to a FormattableNumber
                return false;
            }
        }
        // compare rendered results to benefit from normalizations done on rendering
        return this.toString() === other.toString();
    }
}

export function toNonScientificNumberString(
    value: string | number | bigint | BigInteger,
): string {
    return new FormattableNumber(value).toString();
}
