/**
 * @jest-environment node
 */

/* global describe, it, expect */

import {
    FiatApiBridgedFiatCurrency,
    FiatApiSupportedCryptoCurrency,
    FiatApiSupportedFiatCurrency,
    getExchangeRates,
    getHistoricExchangeRates,
} from '../src/fiat-api/FiatApi';

describe('FiatApi', () => {
    it('can fetch current USD rate for BTC', async () => {
        const rate = await getExchangeRates(
            [FiatApiSupportedCryptoCurrency.BTC],
            [FiatApiSupportedFiatCurrency.USD],
        );
        expect(rate[FiatApiSupportedCryptoCurrency.BTC][FiatApiSupportedFiatCurrency.USD]).toBeGreaterThan(0);
    });

    it('can fetch current bridged CRC rate for BTC', async () => {
        const rate = await getExchangeRates(
            [FiatApiSupportedCryptoCurrency.BTC],
            [FiatApiBridgedFiatCurrency.CRC],
        );
        expect(rate[FiatApiSupportedCryptoCurrency.BTC][FiatApiBridgedFiatCurrency.CRC]).toBeGreaterThan(0);
    });

    it('can fetch historic USD rates for BTC', async () => {
        const timestamps = [
            new Date('2023-01-01T00:00:00.000Z').getTime(),
            new Date('2023-01-01T01:00:00.000Z').getTime(),
            new Date('2023-01-01T02:00:00.000Z').getTime(),
            new Date('2023-01-01T03:00:00.000Z').getTime(),
            new Date('2023-01-01T04:00:00.000Z').getTime(),
            new Date('2023-10-13T05:00:00.000Z').getTime(),
            new Date('2023-10-13T06:00:00.000Z').getTime(),
            new Date('2023-10-13T07:00:00.000Z').getTime(),
            new Date('2023-10-13T08:00:00.000Z').getTime(),
            new Date('2023-10-13T09:00:00.000Z').getTime(),
        ];
        const rates = await getHistoricExchangeRates(
            FiatApiSupportedCryptoCurrency.BTC,
            FiatApiSupportedFiatCurrency.USD,
            timestamps,
        );
        expect(rates.size).toBe(10);
        expect(rates.get(timestamps[0])).toBe(16541.90475052885);
        expect(rates.get(timestamps[1])).toBe(16543.017237311888);
        expect(rates.get(timestamps[5])).toBe(26793.954797943756);
        expect(rates.get(timestamps[6])).toBe(26810.776705117445);
    });

    it('can fetch historic CRC (bridged) rates for BTC', async () => {
        const timestamps = [
            new Date('2023-01-01T00:00:00.000Z').getTime(),
            new Date('2023-01-01T01:00:00.000Z').getTime(),
            new Date('2023-01-01T02:00:00.000Z').getTime(),
            new Date('2023-01-01T03:00:00.000Z').getTime(),
            new Date('2023-01-01T04:00:00.000Z').getTime(),
            new Date('2023-10-13T05:00:00.000Z').getTime(),
            new Date('2023-10-13T06:00:00.000Z').getTime(),
            new Date('2023-10-13T07:00:00.000Z').getTime(),
            new Date('2023-10-13T08:00:00.000Z').getTime(),
            new Date('2023-10-13T09:00:00.000Z').getTime(),
        ];
        const rates = await getHistoricExchangeRates(
            FiatApiSupportedCryptoCurrency.BTC,
            FiatApiBridgedFiatCurrency.CRC,
            timestamps,
        );
        expect(rates.size).toBe(10);
        expect(rates.get(timestamps[0])).toBe(9893382.393196296);
        expect(rates.get(timestamps[1])).toBe(9894047.749291496);
        expect(rates.get(timestamps[5])).toBe(14290555.791483302);
        expect(rates.get(timestamps[6])).toBe(14244742.864549162);
    });
});
