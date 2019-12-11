/* global describe, beforeAll, afterAll, it, expect */

import { TextDecoder as NodeTextDecoder } from 'util';
import { Utf8Tools } from '../src/utf8-tools/Utf8Tools';

declare namespace global {
    let TextDecoder: any;
}

const asciiString = 'abc';
const asciiBytes = new Uint8Array([97, 98, 99]);

// See https://github.com/nimiq/nimiq-utils/issues/34
const hanziString = '成員國';
const hanziBytes = new Uint8Array([230, 136, 144, 229, 147, 161, 229, 156, 139]);

// See https://mathiasbynens.be/notes/javascript-unicode#poo-test
const astralString = '💩';
const astralBytes = new Uint8Array([240, 159, 146, 169]);

const controlCharString = '\u0000';
const controlCharBytes = new Uint8Array([0]);

const whiteListedControlCharString = '\n';
const whiteListedControlCharBytes = new Uint8Array([10]);

function testStringToUtf8ByteArray() {
    expect(Utf8Tools.stringToUtf8ByteArray(asciiString)).toEqual(asciiBytes);
    expect(Utf8Tools.stringToUtf8ByteArray(hanziString)).toEqual(hanziBytes);
    expect(Utf8Tools.stringToUtf8ByteArray(astralString)).toEqual(astralBytes);
    expect(Utf8Tools.stringToUtf8ByteArray(controlCharString)).toEqual(controlCharBytes);
    expect(Utf8Tools.stringToUtf8ByteArray(whiteListedControlCharString)).toEqual(whiteListedControlCharBytes);
}

function testUtf8ByteArrayToString() {
    expect(Utf8Tools.utf8ByteArrayToString(asciiBytes)).toEqual(asciiString);
    expect(Utf8Tools.utf8ByteArrayToString(hanziBytes)).toEqual(hanziString);
    expect(Utf8Tools.utf8ByteArrayToString(astralBytes)).toEqual(astralString);
    expect(Utf8Tools.utf8ByteArrayToString(controlCharBytes)).toEqual(controlCharString);
    expect(Utf8Tools.utf8ByteArrayToString(whiteListedControlCharBytes)).toEqual(whiteListedControlCharString);
}

function testIsValidUtf8() {
    expect(Utf8Tools.isValidUtf8(asciiBytes)).toBe(true);
    expect(Utf8Tools.isValidUtf8(hanziBytes)).toBe(true);
    expect(Utf8Tools.isValidUtf8(astralBytes)).toBe(true);
    expect(Utf8Tools.isValidUtf8(controlCharBytes)).toBe(true);
    expect(Utf8Tools.isValidUtf8(whiteListedControlCharBytes)).toBe(true);

    expect(Utf8Tools.isValidUtf8(hanziBytes.subarray(0, hanziBytes.length - 1))).toBe(false);
    expect(Utf8Tools.isValidUtf8(astralBytes.subarray(0, astralBytes.length - 1))).toBe(false);

    expect(Utf8Tools.isValidUtf8(controlCharBytes, true)).toBe(false);
    expect(Utf8Tools.isValidUtf8(whiteListedControlCharBytes, true)).toBe(true);
}

describe('Utf8Tools', () => {
    describe('native TextDecoder', () => {
        beforeAll(() => {
            global.TextDecoder = NodeTextDecoder;
        });

        afterAll(() => {
            delete global.TextDecoder;
        });

        it('can transform strings to utf-8.', testStringToUtf8ByteArray);

        it('can transform utf-8 bytes to strings.', testUtf8ByteArrayToString);

        it('can validate utf-8 bytes.', testIsValidUtf8);
    });

    describe('fallback', () => {
        it('can transform strings to utf-8.', testStringToUtf8ByteArray);

        it('can transform utf-8 bytes to strings.', testUtf8ByteArrayToString);

        it('can validate utf-8 bytes.', testIsValidUtf8);
    });
});
