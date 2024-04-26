/**
 * @jest-environment node
 */

/* global describe, it, xit, expect */

import {
    BridgeableFiatCurrency,
    CryptoCurrency,
    FiatCurrency,
    RateType,
    Provider,
    ProviderFiatCurrency,
    getExchangeRates,
    getHistoricExchangeRates,
    setCoinGeckoApiUrl,
    setCoinGeckoApiExtraHeader,
} from '../src/fiat-api/FiatApi';

const referenceHistoricRatesCryptoCompare = new Map([
    [new Date('2024-01-01T00:00:00.000Z').getTime(), { usd: 42280.14, crc: 22114627.226999998 }],
    [new Date('2024-01-01T01:00:00.000Z').getTime(), { usd: 42458.92, crc: 22208138.106 }],
    [new Date('2024-01-01T02:00:00.000Z').getTime(), { usd: 42599.81, crc: 22281830.6205 }],

    [new Date('2024-04-01T00:00:00.000Z').getTime(), { usd: 71312.91, crc: 35870393.730000004 }],
    [new Date('2024-04-02T00:00:00.000Z').getTime(), { usd: 69686.37, crc: 35052244.11 }],
    [new Date('2024-04-03T00:00:00.000Z').getTime(), { usd: 65466.81, crc: 32847317.2494 }],
]);

// Timestamps chosen in a way, that two CoinGecko request chunks get created (a single chunk spans 90 days max).
// Note: CoinGecko's public api only allows fetching historic rates for the last 365 days. Therefore, this test vector
// needs to be updated on a yearly basis.
const referenceHistoricRatesCoinGecko = new Map([
    [new Date('2024-01-01T00:00:00.000Z').getTime(), { usd: 42261.72545509639, crc: 22104995.499288168 }],
    [new Date('2024-01-01T01:00:00.000Z').getTime(), { usd: 42490.22251263108, crc: 22224510.885231685 }],
    [new Date('2024-01-01T02:00:00.000Z').getTime(), { usd: 42652.12131449001, crc: 22309192.053544 }],

    [new Date('2024-04-01T00:00:00.000Z').getTime(), { usd: 71182.42807620876, crc: 35804761.32233301 }],
    [new Date('2024-04-02T00:00:00.000Z').getTime(), { usd: 69634.9924715534, crc: 35026401.21319136 }],
    [new Date('2024-04-03T00:00:00.000Z').getTime(), { usd: 65561.26872480597, crc: 32894710.969984144 }],
]);

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
    const timeout = !isPublicCoinGecko || isCI ? /* use default timeout of 5000 */ undefined : 300_000;

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
    describe('CryptoCompare Provider', () => describeProviderTests(Provider.CryptoCompare));
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
