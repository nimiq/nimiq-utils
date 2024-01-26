/**
 * Sources:
 *
 * Conversion functions taken from
 * https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 *
 * UTF-8 validitiy limit values from
 * https://lemire.me/blog/2018/05/09/how-quickly-can-you-check-that-a-string-is-valid-unicode-utf-8/
 */
export declare class Utf8Tools {
    static stringToUtf8ByteArray(str: string): Uint8Array;
    static utf8ByteArrayToString(bytes: Uint8Array): string;
    static isValidUtf8(bytes: Uint8Array, denyControlCharacters?: boolean): boolean;
    static truncateToUtf8ByteLength(input: string, length: number, applyEllipsis?: boolean): {
        result: string;
        didTruncate: boolean;
    };
    static truncateToUtf8ByteLength(input: Uint8Array, length: number, applyEllipsis?: boolean): {
        result: Uint8Array;
        didTruncate: boolean;
    };
}
