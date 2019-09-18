// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger;

const NUMBER_REGEX = /^(-?)(\d*)\.?(\d*)(e(-?\d+))?$/;

export function toNonScientificNumberString(
    value: string | number | bigint | BigInteger,
): string {
    if (typeof value === 'string') {
        const numberMatch = value.match(NUMBER_REGEX);
        if (!numberMatch) throw new Error(`${value} is not a valid number`);
        const [, sign, integerPart, decimalPart, , moveCommaBy] = numberMatch; // manual disassembly to avoid recursion
        if (!integerPart && !decimalPart) throw new Error(`${value} is not a valid number`);
        value = _assembleNumber(sign as '-' | '', integerPart, decimalPart); // normalizes and trims the number
        if (moveCommaBy) {
            // remove scientific notation
            return moveComma(value, parseInt(moveCommaBy));
        } else {
            return value;
        }
    }

    let valueString = '';
    if (typeof value === 'number' || typeof value === 'bigint') {
        // Use toLocalString to render a string without scientific notation. Note that 20 is the maximum allowed number
        // of fraction digits.
        valueString = value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 });
    }
    if (typeof value !== 'number' && !/^\d+$/.test(valueString)) {
        // Non-native BigInteger or incomplete bigint toLocaleString support (e.g. Chrome 67-75, Firefox 68-?) which
        // potentially let to a rendering that is not a plain number. Fallback to toString, which seems to be generating
        // strings without scientific notation although there is no guarantee.
        valueString = value.toString();
    }
    return valueString;
}

export function formatNumber(
    value: string | number | bigint | BigInteger,
    maxDecimals?: number,
    minDecimals?: number,
    groupSeparator = '\u202F', // thin space (U+202F)
): string {
    if (maxDecimals !== undefined && minDecimals !== undefined) {
        minDecimals = Math.min(minDecimals, maxDecimals);
    }
    if (maxDecimals !== undefined) {
        value = round(value, maxDecimals);
    }
    let { sign, integerPart, decimalPart } = _disassembleNumber(value);
    if (minDecimals !== undefined) {
        decimalPart = decimalPart.padEnd(minDecimals, '0');
    }

    // Apply grouping for values with more than 4 integer digits.
    if (integerPart.length > 4) {
        integerPart = integerPart.replace(/(\d)(?=(\d{3})+$)/g, `$1${groupSeparator}`);
    }

    return _assembleNumber(sign, integerPart, decimalPart, false);
}

// moves comma and returns a string without precision loss
export function moveComma(
    value: string | number | bigint | BigInteger,
    moveBy: number,
): string {
    const { sign, integerPart, dotPosition, decimalPart } = _disassembleNumber(value);
    let digits = `${integerPart}${decimalPart}`;
    let newDotPosition = dotPosition + moveBy;

    if (newDotPosition > digits.length) {
        digits = digits.padEnd(newDotPosition, '0');
    } else if (newDotPosition < 0) {
        digits = digits.padStart(digits.length - newDotPosition, '0');
        newDotPosition = 0;
    }
    const newIntegerPart = digits.substring(0, newDotPosition);
    const newDecimalPart = digits.substring(newDotPosition);

    return _assembleNumber(sign, newIntegerPart, newDecimalPart);
}

export function round(
    value: string | number | bigint | BigInteger,
    decimals: number,
): string {
    const { sign, integerPart, dotPosition, decimalPart } = _disassembleNumber(value);
    const decimalsToKeep = decimalPart.substring(0, decimals);
    const decimalsToRemove = decimalPart.substring(decimals);
    if (!decimalsToRemove || parseInt(decimalsToRemove[0]) < 5) {
        // rounding down, can just use the trimmed decimals
        return _assembleNumber(sign, integerPart, decimalsToKeep);
    }

    // round up
    const digits = `0${integerPart}${decimalsToKeep}`.split(''); // add a leading 0 for easier handling of carry
    const newDotPosition = dotPosition + 1; // account for added leading 0
    for (let i = digits.length - 1; i >= 0; --i) {
        const newDigit = parseInt(digits[i]) + 1;
        if (newDigit < 10) {
            digits[i] = newDigit.toString();
            break; // no carry over, break
        } else {
            digits[i] = '0';
            // continue loop to handle carry over
        }
    }
    const newIntegerPart = digits.slice(0, newDotPosition).join('');
    const newDecimalPart = digits.slice(newDotPosition).join('');
    return _assembleNumber(sign, newIntegerPart, newDecimalPart); // trims the leading 0 if it was not necessary
}

function _disassembleNumber(
    value: string | number | bigint | BigInteger,
): { sign: '-' | '', integerPart: string, dotPosition: number, decimalPart: string } {
    value = toNonScientificNumberString(value);
    const [, sign, integerPart, decimalPart] = value.match(NUMBER_REGEX)!;

    return {
        sign: sign as '-' | '',
        integerPart,
        dotPosition: integerPart.length,
        decimalPart,
    };
}

function _assembleNumber(
    sign: '-' | '',
    integerPart: string,
    decimalPart: string,
    trim: boolean = true,
): string {
    if (trim) {
        integerPart = integerPart.replace(/^0+/, ''); // trim leading zeros
        decimalPart = decimalPart.replace(/0+$/, ''); // trim trailing zeros
    }
    return `${sign}${integerPart || '0'}${decimalPart ? `.${decimalPart}` : ''}`;
}
