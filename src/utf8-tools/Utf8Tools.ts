/* eslint-disable no-bitwise, no-plusplus, eqeqeq */

/**
 * Sources:
 *
 * Conversion functions taken from
 * https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 *
 * UTF-8 validitiy limit values from
 * https://lemire.me/blog/2018/05/09/how-quickly-can-you-check-that-a-string-is-valid-unicode-utf-8/
 */

export class Utf8Tools {
    public static stringToUtf8ByteArray(str: string): Uint8Array {
        if (typeof TextEncoder !== 'undefined') {
            const encoder = new TextEncoder(); // utf-8 is the default
            return encoder.encode(str);
        }

        // Fallback for unsupported TextEncoder
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            } else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            } else if (
                ((c & 0xFC00) == 0xD800) && (i + 1) < str.length
            && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            } else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return new Uint8Array(out);
    }

    public static utf8ByteArrayToString(bytes: Uint8Array): string {
        if (typeof TextDecoder !== 'undefined') {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(bytes);
        }

        // Fallback for unsupported TextDecoder
        const out = [];
        let pos = 0;
        let c = 0;
        while (pos < bytes.length) {
            /* eslint-disable no-mixed-operators */
            const c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            } else if (c1 > 191 && c1 < 224) {
                const c2 = bytes[pos++];
                out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            } else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                const c4 = bytes[pos++];
                const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
                out[c++] = String.fromCharCode(0xD800 + (u >> 10));
                out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
            } else {
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            }
            /* eslint-enable no-mixed-operators */
        }
        return out.join('');
    }

    public static isValidUtf8(bytes: Uint8Array, denyControlCharacters = false): boolean {
        // We cannot use the build-in TextDecoder to check for validity, as we need to
        // also filter out control characters, which are valid UTF8.

        let i = 0;

        while (i < bytes.length) {
            const first = bytes[i]; // The byte

            const controlCharsWhitelist = [
                0x09, /* horizontal tab (\t) */
                0x0A, /* line feed (\n) */
                0x0D, /* carriage return (\r) */
            ];

            /* eslint-disable brace-style */
            if (first <= 0x7F) { // Possible one-byte
                if (!denyControlCharacters) ++i; // Valid single-byte character (ASCII)
                else if (controlCharsWhitelist.indexOf(first) > -1) ++i;
                else if (first >= 0x20 /* space */ && first <= 0x7E /* tilde */) ++i; // Only allow non-control chars
                else break;
            }

            else if (first >= 0xC2 && first <= 0xDF) { // Possible two-byte
                const second = bytes[++i];

                if (second >= 0x80 && second <= 0xBF) ++i; // Is valid two-byte
                else break;
            }

            else if (first === 0xE0) { // Possible three-byte
                const second = bytes[++i];
                const third = bytes[++i];

                if (second >= 0xA0 && second <= 0xBF
                 && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
                else break;
            }

            else if (first >= 0xE1 && first <= 0xEC) { // Possible three-byte
                const second = bytes[++i];
                const third = bytes[++i];

                if (second >= 0x80 && second <= 0xBF
                 && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
                else break;
            }

            else if (first === 0xED) { // Possible three-byte
                const second = bytes[++i];
                const third = bytes[++i];

                if (second >= 0x80 && second <= 0x9F
                 && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
                else break;
            }

            else if (first >= 0xEE && first <= 0xEF) { // Possible three-byte
                const second = bytes[++i];
                const third = bytes[++i];

                if (second >= 0x80 && second <= 0xBF
                 && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
                else break;
            }

            else if (first === 0xF0) { // Possible four-byte
                const second = bytes[++i];
                const third = bytes[++i];
                const fourth = bytes[++i];

                if (second >= 0x90 && second <= 0xBF
                 && third >= 0x80 && third <= 0xBF
                 && fourth >= 0x80 && fourth <= 0xBF) ++i; // Is valid four-byte
                else break;
            }

            else if (first >= 0xF1 && first <= 0xF3) { // Possible four-byte
                const second = bytes[++i];
                const third = bytes[++i];
                const fourth = bytes[++i];

                if (second >= 0x80 && second <= 0xBF
                 && third >= 0x80 && third <= 0xBF
                 && fourth >= 0x80 && fourth <= 0xBF) ++i; // Is valid four-byte
                else break;
            }

            else if (first === 0xF4) { // Possible four-byte
                const second = bytes[++i];
                const third = bytes[++i];
                const fourth = bytes[++i];

                if (second >= 0x80 && second <= 0x8F
                 && third >= 0x80 && third <= 0xBF
                 && fourth >= 0x80 && fourth <= 0xBF) ++i; // Is valid four-byte
                else break;
            }

            else break;
            /* eslint-enable brace-style */
        }

        // If the whole array was walked successfully, then the last check also increased the counter
        // and the index i is equal to the length of the array.
        // If the while loop was broken early, i is smaller and the array is not valid UTF-8.
        return i === bytes.length;
    }
}
