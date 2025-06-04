export class Utf8Tools {
    public static stringToUtf8ByteArray(str: string): Uint8Array {
        const encoder = new TextEncoder(); // utf-8 is the default
        return encoder.encode(str);
    }

    public static utf8ByteArrayToString(bytes: Uint8Array): string {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    public static isValidUtf8(bytes: Uint8Array, denyControlCharacters = false): boolean {
        const controlCharsWhitelist = [
            0x09, /* horizontal tab (\t) */
            0x0A, /* line feed (\n) */
            0x0D, /* carriage return (\r) */
        ];

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

    /* eslint-disable lines-between-class-members */
    public static truncateToUtf8ByteLength(input: string, length: number, applyEllipsis?: boolean)
        : { result: string, didTruncate: boolean };
    public static truncateToUtf8ByteLength(input: Uint8Array, length: number, applyEllipsis?: boolean)
        : { result: Uint8Array, didTruncate: boolean };
    public static truncateToUtf8ByteLength(input: string | Uint8Array, length: number, applyEllipsis: boolean = true)
        : { result: string | Uint8Array, didTruncate: boolean } {
        if (length < 0) {
            throw new Error('Invalid byte length');
        }

        let bytes: Uint8Array;
        if (typeof input === 'string') {
            bytes = Utf8Tools.stringToUtf8ByteArray(input);
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
        while (!Utf8Tools.isValidUtf8(bytes)) bytes = bytes.subarray(0, bytes.length - 1);

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
            result: typeof input === 'string' ? Utf8Tools.utf8ByteArrayToString(bytes) : bytes,
            didTruncate: true,
        };
    }
    /* eslint-enable lines-between-class-members */
}
