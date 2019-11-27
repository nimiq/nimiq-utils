/* global describe, it, expect */

import { FormattableNumber } from '../src/formattable-number/FormattableNumber';

describe('FormattableNumber', () => {
    fit('Can round numbers', () => {
        expect(new FormattableNumber(12345.12355).round(2).toString()).toBe('12345.12');
        expect(new FormattableNumber(12345.125).round(2).toString()).toBe('12345.13');
        expect(new FormattableNumber(12345.123).round(0).toString()).toBe('12345');
        expect(new FormattableNumber(12344.123).round(-1).toString()).toBe('12340');
        expect(new FormattableNumber(12345.123).round(-2).toString()).toBe('12300');
        expect(new FormattableNumber(12345.123).round(-1).toString()).toBe('12350');
        expect(new FormattableNumber(12355.123).round(-2).toString()).toBe('12400');
    });
});
