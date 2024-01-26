type BigInteger = import('big-integer').BigInteger;
export declare class FormattableNumber {
    private static readonly NUMBER_REGEX;
    private _digits;
    private _decimalSeparatorPosition;
    private _sign;
    constructor(value: string | number | bigint | BigInteger);
    toString(optionsOrUseGrouping?: {
        maxDecimals?: number;
        minDecimals?: number;
        useGrouping?: boolean;
        groupSeparator?: string;
    } | boolean): string;
    valueOf(): string;
    moveDecimalSeparator(moveBy: number): this;
    round(decimals: number): this;
    equals(other: any): boolean;
}
export declare function toNonScientificNumberString(value: string | number | bigint | BigInteger): string;
export {};
