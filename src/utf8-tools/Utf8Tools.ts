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

export function stringToUtf8ByteArray(str: string): Uint8Array {
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

export function utf8ByteArrayToString(bytes: Uint8Array): string {
    if (typeof TextDecoder !== 'undefined') {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    // Fallback for unsupported TextDecoder.
    // Note that this fallback can result in a different decoding for invalid utf8 than the native implementation.
    // This is the case when a character requires more bytes than are left in the array which is not handled here.
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

export function isValidUtf8(bytes: Uint8Array, denyControlCharacters = false): boolean {
    const controlCharsWhitelist = [
        0x09, /* horizontal tab (\t) */
        0x0A, /* line feed (\n) */
        0x0D, /* carriage return (\r) */
    ];

    if (typeof TextDecoder !== 'undefined') {
        try {
            const decoder = new TextDecoder('utf-8', { fatal: true });
            const decoded = decoder.decode(bytes); // throws for invalid input
            if (!denyControlCharacters) return true;
            // Search for control characters (utf-8 single byte characters (0x00-0x7F) which are not in the range
            // 0x20-0x7E (space-tilde)). Note that we use the unicode u flag to avoid astral symbols (symbols
            // outside the range 0x0000 - 0xFFFF) getting split up into two surrogate halves.
            // See https://mathiasbynens.be/notes/javascript-unicode#regex
            // eslint-disable-next-line no-control-regex
            const controlCharsMatch = decoded.match(/[\u0000-\u001F\u007F]/gu);
            if (!controlCharsMatch) return true;
            return controlCharsMatch.every((char) => controlCharsWhitelist.includes(char.charCodeAt(0)));
        } catch (e) {
            return false;
        }
    }

    // Fallback for unsupported TextDecoder
    let i = 0;

    while (i < bytes.length) {
        const bytesLeft = bytes.length - i;
        const first = bytes[i]; // The byte

        /* eslint-disable brace-style */
        if (first <= 0x7F) { // Possible one-byte
            if (first >= 0x20 /* space */ && first <= 0x7E /* tilde */) ++i; // non-control chars
            else if (!denyControlCharacters) ++i; // it's a control char but we're accepting them
            else if (controlCharsWhitelist.indexOf(first) > -1) ++i; // whitelisted control char
            else break;
        }

        else if (first >= 0xC2 && first <= 0xDF && bytesLeft >= 2) { // Possible two-byte
            const second = bytes[++i];

            if (second >= 0x80 && second <= 0xBF) ++i; // Is valid two-byte
            else break;
        }

        else if (first === 0xE0 && bytesLeft >= 3) { // Possible three-byte
            const second = bytes[++i];
            const third = bytes[++i];

            if (second >= 0xA0 && second <= 0xBF
                && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
            else break;
        }

        else if (first >= 0xE1 && first <= 0xEC && bytesLeft >= 3) { // Possible three-byte
            const second = bytes[++i];
            const third = bytes[++i];

            if (second >= 0x80 && second <= 0xBF
                && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
            else break;
        }

        else if (first === 0xED && bytesLeft >= 3) { // Possible three-byte
            const second = bytes[++i];
            const third = bytes[++i];

            if (second >= 0x80 && second <= 0x9F
                && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
            else break;
        }

        else if (first >= 0xEE && first <= 0xEF && bytesLeft >= 3) { // Possible three-byte
            const second = bytes[++i];
            const third = bytes[++i];

            if (second >= 0x80 && second <= 0xBF
                && third >= 0x80 && third <= 0xBF) ++i; // Is valid three-byte
            else break;
        }

        else if (first === 0xF0 && bytesLeft >= 4) { // Possible four-byte
            const second = bytes[++i];
            const third = bytes[++i];
            const fourth = bytes[++i];

            if (second >= 0x90 && second <= 0xBF
                && third >= 0x80 && third <= 0xBF
                && fourth >= 0x80 && fourth <= 0xBF) ++i; // Is valid four-byte
            else break;
        }

        else if (first >= 0xF1 && first <= 0xF3 && bytesLeft >= 4) { // Possible four-byte
            const second = bytes[++i];
            const third = bytes[++i];
            const fourth = bytes[++i];

            if (second >= 0x80 && second <= 0xBF
                && third >= 0x80 && third <= 0xBF
                && fourth >= 0x80 && fourth <= 0xBF) ++i; // Is valid four-byte
            else break;
        }

        else if (first === 0xF4 && bytesLeft >= 4) { // Possible four-byte
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

export function truncateToUtf8ByteLength(input: string, length: number, applyEllipsis?: boolean)
    : { result: string, didTruncate: boolean };
export function truncateToUtf8ByteLength(input: Uint8Array, length: number, applyEllipsis?: boolean)
    : { result: Uint8Array, didTruncate: boolean };
export function truncateToUtf8ByteLength(input: string | Uint8Array, length: number, applyEllipsis: boolean = true)
    : { result: string | Uint8Array, didTruncate: boolean } {
    if (length < 0) {
        throw new Error('Invalid byte length');
    }

    let bytes: Uint8Array;
    if (typeof input === 'string') {
        bytes = stringToUtf8ByteArray(input);
    } else {
        bytes = input;
    }

    if (bytes.length <= length) {
        return {
            result: input,
            didTruncate: false,
        };
    }

    const ellipsisBytes = [226, 128, 166];
    if (length < ellipsisBytes.length) applyEllipsis = false;

    bytes = bytes.subarray(0, length - (applyEllipsis ? ellipsisBytes.length : 0));

    // Cut off last byte until byte array is valid utf-8
    while (!isValidUtf8(bytes)) bytes = bytes.subarray(0, bytes.length - 1);

    if (applyEllipsis) {
        // Add ellipsis. Note that we can safely extend by the ellipsis bytes as we shoved these bytes off before.
        bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.length + ellipsisBytes.length);
        if (typeof input !== 'string') {
            // We're working on the input bytes. Create a copy to not modify the original data.
            bytes = new Uint8Array(bytes);
        }
        bytes.set(ellipsisBytes, bytes.length - ellipsisBytes.length);
    }

    return {
        result: typeof input === 'string' ? utf8ByteArrayToString(bytes) : bytes,
        didTruncate: true,
    };
}
