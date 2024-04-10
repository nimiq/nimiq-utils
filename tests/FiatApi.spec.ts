/**
 * @jest-environment node
 */

/* global describe, it, xit, expect */

import {
    BridgeableFiatCurrency,
    CryptoCurrency,
    FiatCurrencyCoinGecko,
    FiatCurrencyCryptoCompare,
    getExchangeRates,
    getHistoricExchangeRates,
    Provider,
} from '../src/fiat-api/FiatApi';

const knownHistoricRatesCryptoCompare = new Map([
    [new Date('2024-01-01T00:00:00.000Z').getTime(), { USD: 42280.14, CRC: 22114627.226999998 }],
    [new Date('2024-01-01T01:00:00.000Z').getTime(), { USD: 42458.92, CRC: 22208138.106 }],
    [new Date('2024-01-01T02:00:00.000Z').getTime(), { USD: 42599.81, CRC: 22281830.6205 }],

    [new Date('2024-04-01T00:00:00.000Z').getTime(), { USD: 71312.91, CRC: 35870393.730000004 }],
    [new Date('2024-04-02T00:00:00.000Z').getTime(), { USD: 69686.37, CRC: 35052244.11 }],
    [new Date('2024-04-03T00:00:00.000Z').getTime(), { USD: 65466.81, CRC: 32847317.2494 }],
]);

// Timestamps chosen in a way, that two Coingecko request chunks get created (a single chunk spans 90 days max).
// Note: Coingecko's public api only allows fetching historic rates for the last 365 days. Therefore, this test vector
// needs to be updated on a yearly basis.
const knownHistoricRatesCoinGecko = new Map([
    [new Date('2024-01-01T00:00:00.000Z').getTime(), { USD: 42261.72545509639, CRC: 22104995.499288168 }],
    [new Date('2024-01-01T01:00:00.000Z').getTime(), { USD: 42490.22251263108, CRC: 22224510.885231685 }],
    [new Date('2024-01-01T02:00:00.000Z').getTime(), { USD: 42652.12131449001, CRC: 22309192.053544 }],

    [new Date('2024-04-01T00:00:00.000Z').getTime(), { USD: 71182.42807620876, CRC: 35804761.32233301 }],
    [new Date('2024-04-02T00:00:00.000Z').getTime(), { USD: 69634.9924715534, CRC: 35026401.21319136 }],
    [new Date('2024-04-03T00:00:00.000Z').getTime(), { USD: 65561.26872480597, CRC: 32894710.969984144 }],
]);

// In CI, reduce CoinGecko tests to only run as little requests as allowed without running into the rate limit (~5/min),
// to avoid long running CI actions.
const isCI = !!process.env.CI;
const itLocallyOnly = isCI ? xit : it;
const coingeckoTimeout = isCI ? /* use default timeout of 5000 */ 0 : 300_000;

describe('FiatApi', () => {
    describe('CryptoCompare Provider', () => {
        it('can fetch current USD rate for BTC', async () => {
            const rate = await getExchangeRates(
                [CryptoCurrency.BTC],
                [FiatCurrencyCryptoCompare.USD],
                Provider.CryptoCompare,
            );
            expect(rate[CryptoCurrency.BTC][FiatCurrencyCryptoCompare.USD]).toBeGreaterThan(0);
        });

        it('can fetch current BCCR-bridged CRC rate for BTC', async () => {
            const rate = await getExchangeRates(
                [CryptoCurrency.BTC],
                [BridgeableFiatCurrency.CRC],
                Provider.CryptoCompare,
            );
            expect(rate[CryptoCurrency.BTC][BridgeableFiatCurrency.CRC]).toBeGreaterThan(0);
        });

        it('can fetch current CPL-bridged GMD and XOF rates for BTC', async () => {
            const rates = await getExchangeRates(
                [CryptoCurrency.BTC],
                [BridgeableFiatCurrency.GMD, BridgeableFiatCurrency.XOF],
                Provider.CryptoCompare,
            );
            expect(rates[CryptoCurrency.BTC][BridgeableFiatCurrency.GMD]).toBeGreaterThan(0);
            expect(rates[CryptoCurrency.BTC][BridgeableFiatCurrency.XOF]).toBeGreaterThan(0);
        });

        it('can fetch historic USD rates for BTC', async () => {
            const rates = await getHistoricExchangeRates(
                CryptoCurrency.BTC,
                FiatCurrencyCryptoCompare.USD,
                [...knownHistoricRatesCryptoCompare.keys()],
                Provider.CryptoCompare,
            );
            const knownRates = new Map([...knownHistoricRatesCryptoCompare.entries()]
                .map(([timestamp, { USD: rate }]) => [timestamp, rate]));
            expect(rates).toEqual(knownRates);
        });

        it('can fetch historic BCCR-bridged CRC rates for BTC', async () => {
            const rates = await getHistoricExchangeRates(
                CryptoCurrency.BTC,
                BridgeableFiatCurrency.CRC,
                [...knownHistoricRatesCryptoCompare.keys()],
                Provider.CryptoCompare,
            );
            const knownRates = new Map([...knownHistoricRatesCryptoCompare.entries()]
                .map(([timestamp, { CRC: rate }]) => [timestamp, rate]));
            expect(rates).toEqual(knownRates);
        });
    });

    describe('CoinGecko Provider', () => {
        it('can fetch current USD rate for BTC', async () => {
            const rate = await getExchangeRates(
                [CryptoCurrency.BTC],
                [FiatCurrencyCoinGecko.USD],
                Provider.CoinGecko,
            );
            expect(rate[CryptoCurrency.BTC][FiatCurrencyCoinGecko.USD]).toBeGreaterThan(0);
        }, coingeckoTimeout);

        itLocallyOnly('can fetch current BCCR-bridged CRC rate for BTC', async () => {
            const rate = await getExchangeRates(
                [CryptoCurrency.BTC],
                [BridgeableFiatCurrency.CRC],
                Provider.CoinGecko,
            );
            expect(rate[CryptoCurrency.BTC][BridgeableFiatCurrency.CRC]).toBeGreaterThan(0);
        }, coingeckoTimeout);

        itLocallyOnly('can fetch current CPL-bridged GMD and XOF rates for BTC', async () => {
            const rates = await getExchangeRates(
                [CryptoCurrency.BTC],
                [BridgeableFiatCurrency.GMD, BridgeableFiatCurrency.XOF],
                Provider.CoinGecko,
            );
            expect(rates[CryptoCurrency.BTC][BridgeableFiatCurrency.GMD]).toBeGreaterThan(0);
            expect(rates[CryptoCurrency.BTC][BridgeableFiatCurrency.XOF]).toBeGreaterThan(0);
        }, coingeckoTimeout);

        it('can fetch historic USD rates for BTC', async () => {
            const rates = await getHistoricExchangeRates(
                CryptoCurrency.BTC,
                FiatCurrencyCoinGecko.USD,
                [...knownHistoricRatesCoinGecko.keys()],
                Provider.CoinGecko,
                /* disableMinutelyData */ true,
            );
            const knownRates = new Map([...knownHistoricRatesCoinGecko.entries()]
                .map(([timestamp, { USD: rate }]) => [timestamp, rate]));
            expect(rates).toEqual(knownRates);
        }, coingeckoTimeout);

        itLocallyOnly('can fetch historic BCCR-bridged CRC rates for BTC', async () => {
            const rates = await getHistoricExchangeRates(
                CryptoCurrency.BTC,
                BridgeableFiatCurrency.CRC,
                [...knownHistoricRatesCoinGecko.keys()],
                Provider.CoinGecko,
                /* disableMinutelyData */ true,
            );
            const knownRates = new Map([...knownHistoricRatesCoinGecko.entries()]
                .map(([timestamp, { CRC: rate }]) => [timestamp, rate]));
            expect(rates).toEqual(knownRates);
        }, coingeckoTimeout);
    });
});
