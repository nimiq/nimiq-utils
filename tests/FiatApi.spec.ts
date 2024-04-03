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

// Timestamps chosen in a way, that two Coingecko request chunks get created (a single chunk spans 90 days max).
// Note: Coingecko's public api only allows fetching historic rates for the last 365 days. Therefore, this test vector
// needs to be updated on a yearly basis.
const knownHistoricRates = new Map([
    [new Date('2024-01-01T00:00:00.000Z').getTime(), { USD: 42261.72545509639, CRC: 22104995.499288168 }],
    [new Date('2024-01-01T01:00:00.000Z').getTime(), { USD: 42490.22251263108, CRC: 22224510.885231685 }],
    [new Date('2024-01-01T02:00:00.000Z').getTime(), { USD: 42652.12131449001, CRC: 22309192.053544 }],

    [new Date('2024-04-01T00:00:00.000Z').getTime(), { USD: 71182.42807620876, CRC: 35804761.32233301 }],
    [new Date('2024-04-02T00:00:00.000Z').getTime(), { USD: 69634.9924715534, CRC: 35026401.21319136 }],
    [new Date('2024-04-03T00:00:00.000Z').getTime(), { USD: 65551.7179705302, CRC: 32890313.392469928 }],
]);

// If tests are failing locally, increase the timeout
const timeout = /* use default timeout of 5000 */ 0;
// const timeout = 300000;

describe('FiatApi', () => {
    it('can fetch current USD rate for BTC', async () => {
        const rate = await getExchangeRates(
            [FiatApiSupportedCryptoCurrency.BTC],
            [FiatApiSupportedFiatCurrency.USD],
        );
        expect(rate[FiatApiSupportedCryptoCurrency.BTC][FiatApiSupportedFiatCurrency.USD]).toBeGreaterThan(0);
    }, timeout);

    it('can fetch current bridged CRC rate for BTC', async () => {
        const rate = await getExchangeRates(
            [FiatApiSupportedCryptoCurrency.BTC],
            [FiatApiBridgedFiatCurrency.CRC],
        );
        expect(rate[FiatApiSupportedCryptoCurrency.BTC][FiatApiBridgedFiatCurrency.CRC]).toBeGreaterThan(0);
    }, timeout);

    it('can fetch current bridged GMD and XOF rates for BTC', async () => {
        const rates = await getExchangeRates(
            [FiatApiSupportedCryptoCurrency.BTC],
            [FiatApiBridgedFiatCurrency.GMD, FiatApiBridgedFiatCurrency.XOF],
        );
        expect(rates[FiatApiSupportedCryptoCurrency.BTC][FiatApiBridgedFiatCurrency.GMD]).toBeGreaterThan(0);
        expect(rates[FiatApiSupportedCryptoCurrency.BTC][FiatApiBridgedFiatCurrency.XOF]).toBeGreaterThan(0);
    }, timeout);

    it('can fetch historic USD rates for BTC', async () => {
        const rates = await getHistoricExchangeRates(
            FiatApiSupportedCryptoCurrency.BTC,
            FiatApiSupportedFiatCurrency.USD,
            [...knownHistoricRates.keys()],
        );
        const knownRates = new Map([...knownHistoricRates.entries()]
            .map(([timestamp, { USD: rate }]) => [timestamp, rate]));
        expect(rates).toEqual(knownRates);
    }, timeout);

    it('can fetch historic CRC (bridged) rates for BTC', async () => {
        const rates = await getHistoricExchangeRates(
            FiatApiSupportedCryptoCurrency.BTC,
            FiatApiBridgedFiatCurrency.CRC,
            [...knownHistoricRates.keys()],
        );
        const knownRates = new Map([...knownHistoricRates.entries()]
            .map(([timestamp, { CRC: rate }]) => [timestamp, rate]));
        expect(rates).toEqual(knownRates);
    }, timeout);
});
