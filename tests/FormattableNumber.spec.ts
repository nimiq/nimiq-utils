/* global describe, it, expect */

import { FormattableNumber } from '../src/formattable-number/FormattableNumber';

describe('FormattableNumber', () => {
    it('Can round numbers', () => {
        // Regular rounding
        expect(new FormattableNumber(12345.12355).round(2).toString()).toBe('12345.12');
        expect(new FormattableNumber(12345.125).round(2).toString()).toBe('12345.13');
        expect(new FormattableNumber(12345.123).round(0).toString()).toBe('12345');

        // Negative rounding
        expect(new FormattableNumber(12344.123).round(-1).toString()).toBe('12340');
        expect(new FormattableNumber(12345.123).round(-2).toString()).toBe('12300');
        expect(new FormattableNumber(12345.123).round(-1).toString()).toBe('12350');
        expect(new FormattableNumber(12355.123).round(-2).toString()).toBe('12400');

        // Overflow
        expect(new FormattableNumber(99.99).round(1).toString()).toBe('100');
        expect(new FormattableNumber(99.99).round(-1).toString()).toBe('100');

        // Edge cases
        expect(new FormattableNumber(12.34).round(2).toString()).toBe('12.34');
        expect(new FormattableNumber(12.34).round(3).toString()).toBe('12.34');
        expect(new FormattableNumber(12.34).round(-1).toString()).toBe('10');
        expect(new FormattableNumber(12.34).round(-2).toString()).toBe('0');
        expect(new FormattableNumber(12.34).round(-3).toString()).toBe('0');
        expect(new FormattableNumber(99).round(-1).toString()).toBe('100');
        expect(new FormattableNumber(99).round(-2).toString()).toBe('100');
        expect(new FormattableNumber(99).round(-3).toString()).toBe('0');
    });
});
