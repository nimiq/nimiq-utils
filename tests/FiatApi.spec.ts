/**
 * @jest-environment node
 */

/* global jest, beforeEach, afterEach, describe, it, xit, expect */

import {
    BridgeableFiatCurrency,
    CryptoCurrency,
    FiatCurrency,
    RateType,
    Provider,
    ProviderFiatCurrency,
    getExchangeRates,
    getHistoricExchangeRates,
    getHistoricExchangeRatesByRange,
    setCoinGeckoApiUrl,
    setCoinGeckoApiExtraHeader,
} from '../src/fiat-api/FiatApi';

const referenceHistoricRatesCryptoCompare = new Map([
    [new Date('2024-10-01T00:00:00.000Z').getTime(), { usd: 63_332.7776140374, crc: 32_909_989.0116007 }],
    [new Date('2024-10-01T01:00:00.000Z').getTime(), { usd: 63_516.7161678004, crc: 33_005_570.099486 }],
    [new Date('2024-10-01T02:00:00.000Z').getTime(), { usd: 63_441.8695515777, crc: 32_966_677.1058382 }],

    [new Date('2025-01-01T00:00:00.000Z').getTime(), { usd: 93_441.6983892194, crc: 47_576_081.440686 }],
    [new Date('2025-01-02T00:00:00.000Z').getTime(), { usd: 94_451.9403687362, crc: 48_090_448.7469403 }],
    [new Date('2025-01-03T00:00:00.000Z').getTime(), { usd: 96_919.3484077694, crc: 49_410_413.8563481 }],
]);

const referenceHistoricRatesCryptoCompareLegacy = new Map([
    [new Date('2024-10-01T00:00:00.000Z').getTime(), { usd: 63_314.81, crc: 32_915_470.2747 }],
    [new Date('2024-10-01T01:00:00.000Z').getTime(), { usd: 63_503.7, crc: 33_013_668.518999998 }],
    [new Date('2024-10-01T02:00:00.000Z').getTime(), { usd: 63_427.01, crc: 32_973_799.6887 }],

    [new Date('2025-01-01T00:00:00.000Z').getTime(), { usd: 93_391.98, crc: 47_601_892.206 }],
    [new Date('2025-01-02T00:00:00.000Z').getTime(), { usd: 94_392.51, crc: 48_111_862.346999995 }],
    [new Date('2025-01-03T00:00:00.000Z').getTime(), { usd: 96_900.96, crc: 49_390_419.312 }],
]);

// Timestamps chosen in a way, that two CoinGecko request chunks get created (a single chunk spans 90 days max).
// Note: CoinGecko's public api only allows fetching historic rates for the last 365 days. Therefore, this test vector
// needs to be updated on a regular basis.
const referenceHistoricRatesCoinGecko = new Map([
    [new Date('2024-10-01T00:00:00.000Z').getTime(), { usd: 63_371.32651243254, crc: 32_944_851.514018305 }],
    [new Date('2024-10-01T01:00:00.000Z').getTime(), { usd: 63_501.04284259247, crc: 33_012_287.142578546 }],
    [new Date('2024-10-01T02:00:00.000Z').getTime(), { usd: 63_419.78842455574, crc: 32_970_045.408273797 }],

    [new Date('2025-01-01T00:00:00.000Z').getTime(), { usd: 93_504.13056022623, crc: 47_659_055.346547306 }],
    [new Date('2025-01-02T00:00:00.000Z').getTime(), { usd: 94_391.07877439166, crc: 48_111_132.85130743 }],
    [new Date('2025-01-03T00:00:00.000Z').getTime(), { usd: 96_894.10388881556, crc: 49_386_924.752129294 }],
]);

// Clear any remaining RateLimitScheduler timeouts after each test.
let timeoutSpy: jest.SpyInstance;
beforeEach(() => {
    timeoutSpy = jest.spyOn(globalThis, 'setTimeout');
});
afterEach(() => {
    for (const { value: timeout } of timeoutSpy.mock.results) {
        clearInterval(timeout);
    }
    timeoutSpy.mockRestore();
});

async function testExchangeRates<
    C extends CryptoCurrency,
    V extends ProviderFiatCurrency<P, RateType.CURRENT> | BridgeableFiatCurrency | CryptoCurrency,
    P extends Provider,
>(
    cryptoCurrencies: C[],
    vsCurrencies: V[],
    provider: P,
) {
    const rates = await getExchangeRates(cryptoCurrencies, vsCurrencies, provider);
    for (const cryptoCurrency of cryptoCurrencies) {
        for (const vsCurrency of vsCurrencies) {
            expect(rates[cryptoCurrency][vsCurrency]).toBeGreaterThan(0);
        }
    }
}

async function testHistoricExchangeRates(
    vsCurrency: FiatCurrency.USD | FiatCurrency.CRC, // only those that we defined reference exchange rates for
    provider: Provider,
) {
    const referenceProviderRates = {
        [Provider.CryptoCompare]: referenceHistoricRatesCryptoCompare,
        [Provider.CryptoCompareLegacy]: referenceHistoricRatesCryptoCompareLegacy,
        [Provider.CoinGecko]: referenceHistoricRatesCoinGecko,
    }[provider];
    const rates = await getHistoricExchangeRates.apply(null, [
        CryptoCurrency.BTC,
        vsCurrency,
        [...referenceProviderRates.keys()],
        provider,
        ...(provider === Provider.CoinGecko ? [{ disableMinutelyData: true }] as const : [] as const),
    ]);
    const referenceRates = new Map([...referenceProviderRates.entries()]
        .map(([timestamp, { [vsCurrency]: rate }]) => [timestamp, rate]));
    expect(rates).toEqual(referenceRates);

    if (provider === Provider.CryptoCompare || provider === Provider.CryptoCompareLegacy) {
        // Test requesting data at lower time resolution.
        const lowerTimeResolutionRates = await getHistoricExchangeRates(
            CryptoCurrency.BTC,
            vsCurrency,
            [...referenceProviderRates.keys()],
            provider,
            { interval: 'days', aggregate: 2 },
        );
        for (const [timestamp, referenceRate] of referenceRates.entries()) {
            // Expect the results at lower time resolution to still be somewhat close to more precise data.
            const lowerTimeResolutionRate = lowerTimeResolutionRates.get(timestamp) || Number.NaN;
            expect(Math.abs(lowerTimeResolutionRate - referenceRate) / referenceRate < 0.1);
        }
    }
}

type CoinGeckoProxyInfo = { url: string, authHeaderName: string, authToken: string };
function describeProviderTests(provider: Provider): void;
function describeProviderTests(provider: Provider.CoinGecko, coinGeckoProxyInfo?: CoinGeckoProxyInfo): void;
function describeProviderTests(provider: Provider, coinGeckoProxyInfo?: CoinGeckoProxyInfo) {
    if (coinGeckoProxyInfo) {
        const { url, authHeaderName, authToken } = coinGeckoProxyInfo;
        beforeAll(() => {
            setCoinGeckoApiUrl(url);
            setCoinGeckoApiExtraHeader(authHeaderName, authToken);
        });
        afterAll(() => {
            setCoinGeckoApiUrl(); // reset
            setCoinGeckoApiExtraHeader(authHeaderName, false); // remove
        });
    }

    // In CI, reduce CoinGecko tests on the public, non-proxied API to only run as little requests as allowed without
    // running into the rate limit (~5/min), to avoid long running CI actions. Locally, allow such tests and increase
    // the timeout accordingly.
    const isCI = !!process.env.CI;
    const isPublicCoinGecko = provider === Provider.CoinGecko && !coinGeckoProxyInfo;
    const itUnlessPublicCoinGeckoCI = !isPublicCoinGecko || !isCI ? it : xit;
    const timeout = !isPublicCoinGecko || isCI ? 15_000 : 300_000;

    // Tests for current rates
    itUnlessPublicCoinGeckoCI(
        'can fetch current USD rate for BTC',
        async () => testExchangeRates([CryptoCurrency.BTC], [FiatCurrency.USD], provider),
        timeout,
    );
    itUnlessPublicCoinGeckoCI(
        'can fetch current BCCR-bridged CRC rate for BTC',
        async () => testExchangeRates([CryptoCurrency.BTC], [FiatCurrency.CRC], provider),
        timeout,
    );
    itUnlessPublicCoinGeckoCI(
        'can fetch current CPL-bridged GMD and XOF rates for BTC',
        async () => testExchangeRates([CryptoCurrency.BTC], [FiatCurrency.GMD, FiatCurrency.XOF], provider),
        timeout,
    );
    it(
        'can fetch all current exchange rates at once',
        async () => testExchangeRates(Object.values(CryptoCurrency), Object.values(FiatCurrency), provider),
        timeout,
    );

    // Tests for historic rates
    it(
        'can fetch historic USD rates for BTC',
        async () => testHistoricExchangeRates(FiatCurrency.USD, provider),
        timeout,
    );
    itUnlessPublicCoinGeckoCI(
        'can fetch historic BCCR-bridged CRC rates for BTC',
        async () => testHistoricExchangeRates(FiatCurrency.CRC, provider),
        timeout,
    );
}

describe('FiatApi', () => {
    describe('CryptoCompare Provider', () => {
        describeProviderTests(Provider.CryptoCompare);

        it('can be combined with CryptoCompareLegacy to get older rates than supported by CryptoCompare', async () => {
            const CRYPTOCOMPARE_NIM_HISTORY_START = 1571356800 * 1000;
            const ONE_HOUR = 60 * 60 * 1000;
            const testRanges = [
                // Overlapping CRYPTOCOMPARE_NIM_HISTORY_START
                [CRYPTOCOMPARE_NIM_HISTORY_START - 2 * ONE_HOUR, CRYPTOCOMPARE_NIM_HISTORY_START + 2 * ONE_HOUR],
                // Before CRYPTOCOMPARE_NIM_HISTORY_START
                [CRYPTOCOMPARE_NIM_HISTORY_START - 5 * ONE_HOUR, CRYPTOCOMPARE_NIM_HISTORY_START - ONE_HOUR],
            ];
            await Promise.all(testRanges.map(async ([from, to]) => {
                const rates = await getHistoricExchangeRatesByRange(
                    CryptoCurrency.NIM,
                    FiatCurrency.USD,
                    from,
                    to,
                    Provider.CryptoCompare,
                );
                expect(rates.length).toBe(5);
                expect(rates[0][0]).toBe(from);
                expect(rates[4][0]).toBe(to);
            }));
        }, 10_000);
    });

    describe('CryptoCompare Legacy Provider', () => describeProviderTests(Provider.CryptoCompareLegacy));
    describe('CoinGecko Provider', () => describeProviderTests(Provider.CoinGecko));

    const {
        COINGECKO_PROXY_AUTHORIZATION_HEADER: coinGeckoProxyAuthHeaderName,
        CI_AUTHORIZATION_TOKEN: coinGeckoProxyAuthToken,
    } = process.env || {};
    if (coinGeckoProxyAuthHeaderName && coinGeckoProxyAuthToken) {
        describe('CoinGecko Provider via Proxy', () => describeProviderTests(Provider.CoinGecko, {
            url: 'https://nq-coingecko-proxy.deno.dev/api/v3',
            authHeaderName: coinGeckoProxyAuthHeaderName,
            authToken: coinGeckoProxyAuthToken,
        }));
    } else {
        console.warn('Tests for FiatApi CoinGecko Provider via Proxy were skipped.'); // eslint-disable-line no-console
    }
});
