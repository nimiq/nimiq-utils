// Note that coingecko supports many more but these are the ones that are currently of interest to us
export enum FiatApiSupportedCryptoCurrency {
    NIM = 'nim',
    BTC = 'btc',
    ETH = 'eth',
}

// Note that coingecko supports more vs_currencies (see https://api.coingecko.com/api/v3/simple/supported_vs_currencies)
// but also includes crypto currencies and ounces of gold amongst others that are not fiat currencies. This list here
// has been generated by reducing the vs_currencies to those that have a currency symbol (using CurrencyInfo.ts)
export enum FiatApiSupportedFiatCurrency {
    AUD = 'aud',
    BRL = 'brl',
    CAD = 'cad',
    CNY = 'cny',
    EUR = 'eur',
    GBP = 'gbp',
    HKD = 'hkd',
    ILS = 'ils',
    INR = 'inr',
    JPY = 'jpy',
    KRW = 'krw',
    MXN = 'mxn',
    NZD = 'nzd',
    TWD = 'twd',
    USD = 'usd',
    VND = 'vnd',
}

let API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_COIN_IDS = {
    [FiatApiSupportedCryptoCurrency.NIM]: 'nimiq-2',
    [FiatApiSupportedCryptoCurrency.BTC]: 'bitcoin',
    [FiatApiSupportedCryptoCurrency.ETH]: 'ethereum',
};

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * @param url The URL to the Coingecko v3 API. Defaults to https://api.coingecko.com/api/v3.
 */
export function setCoingeckoApiUrl(url: string) {
    API_URL = url;
}

export async function getExchangeRates(
    cryptoCurrencies: Array<FiatApiSupportedCryptoCurrency>,
    vsCurrencies: Array<FiatApiSupportedFiatCurrency | FiatApiSupportedCryptoCurrency>,
): Promise<{ [crypto: string]: { [vsCurrency: string]: number | undefined } }> {
    const coinIds = cryptoCurrencies.map((currency) => COINGECKO_COIN_IDS[currency]);
    const apiResult = await _fetch(`${API_URL}/simple/price`
        + `?ids=${coinIds.join(',')}&vs_currencies=${vsCurrencies.join(',')}`);
    // Map coingecko coin ids back to FiatApiSupportedCryptoCurrency enum
    return cryptoCurrencies.reduce((result, cryptoCurrency) => ({
        ...result,
        [cryptoCurrency]: apiResult[COINGECKO_COIN_IDS[cryptoCurrency]],
    }), {});
}

/**
 * Request historic exchange rates by range. Note that the time resolution depends on the chosen range. Coingecko
 * provides minutely for ranges within 1 day from the current time, hourly data for any ranges between 1 day and 90 days
 * (do not need to be within 90 days from current time) and daily for ranges above 90 days.
 * Note that minutely data is ~5-10 minutes apart, hourly data about an hour.
 * Input and output timestamps are in milliseconds.
 */
export async function getHistoricExchangeRatesByRange(
    cryptoCurrency: FiatApiSupportedCryptoCurrency,
    vsCurrency: FiatApiSupportedFiatCurrency | FiatApiSupportedCryptoCurrency,
    from: number, // in milliseconds
    to: number, // in milliseconds
): Promise<Array<[number, number]>> {
    const coinId = COINGECKO_COIN_IDS[cryptoCurrency];
    // Note that from and to are expected in seconds but returned timestamps are in ms.
    from = Math.floor(from / 1000);
    to = Math.ceil(to / 1000);
    const { prices: result } = await _fetch(`${API_URL}/coins/${coinId}/market_chart/range`
        + `?vs_currency=${vsCurrency}&from=${from}&to=${to}`);
    return result;
}

/**
 * Get historic exchange rates at specific timestamps in milliseconds.
 */
export async function getHistoricExchangeRates(
    cryptoCurrency: FiatApiSupportedCryptoCurrency,
    vsCurrency: FiatApiSupportedFiatCurrency | FiatApiSupportedCryptoCurrency,
    timestamps: number[],
    disableMinutlyData = false,
): Promise<Map<number, number|undefined>> {
    const result = new Map<number, number|undefined>();
    if (!timestamps.length) return result;

    // 1. Create chunks.
    // To get the best possible time resolution, we split the timestamps into a chunk within at most 1 day from now
    // and the rest into additional 90 day chunks.
    const now = Date.now();
    const chunks: Array<{ start: number, end: number }> = [];
    let timestampIndex = timestamps.length - 1;
    timestamps.sort((a, b) => a - b);

    // Create one day chunk
    if (!disableMinutlyData && now - timestamps[timestamps.length - 1] < ONE_DAY - 15 * ONE_MINUTE) {
        // Has a timestamp within last day (minus safety margin in case our clock is slightly off).
        // As one day is calculated from now and not from the timestamp, we have to account for the difference
        // between now and the timestamp.
        const maxChunkLength = ONE_DAY - 15 * ONE_MINUTE - (now - timestamps[timestamps.length - 1]);
        const { chunk, searchEndIndex } = _findTimestampChunk(
            timestamps,
            timestampIndex,
            maxChunkLength,
            // Prices are 5-10 min apart, chose margin such we get earlier and later data point for interpolation
            10 * ONE_MINUTE,
        );
        chunks.push(chunk);
        timestampIndex = searchEndIndex;
    }

    // Create additional 90 day chunks
    while (timestampIndex >= 0) {
        const { chunk, searchEndIndex } = _findTimestampChunk(
            timestamps,
            timestampIndex,
            90 * ONE_DAY,
            // Prices are ~1h apart, chose margin such we get earlier and later data point for interpolation
            1.5 * ONE_HOUR,
        );
        chunks.push(chunk);
        timestampIndex = searchEndIndex;
    }

    // 2. Query Coingecko Api
    const fetchPromises = chunks.map(
        (chunk) => getHistoricExchangeRatesByRange(cryptoCurrency, vsCurrency, chunk.start, chunk.end),
    );
    const prices = (await Promise.all(fetchPromises)).reduce(
        (accumulated, singleResult) => [...singleResult, ...accumulated],
        [] as Array<[number, number]>,
    ).sort((a, b) => a[0] - b[0]); // have to re-sort by timestamp as chunks might be overlapping
    if (!prices.length) return result; // Happens if coingecko doesn't have data for any of requested timestamps,
    // for example for days before coingecko started collecting Nim price info or for days in the future.

    // 3. For every requested timestamp interpolate the price from the timestamps we got from the API
    timestampIndex = 0;
    let priceIndex = 0;
    while (timestampIndex < timestamps.length) {
        // Search priceIndex at which predecessor price timestamp < our timestamp <= current price timestamp.
        const timestamp = timestamps[timestampIndex];
        while (priceIndex < prices.length && prices[priceIndex][0] < timestamp) {
            ++priceIndex;
        }
        if (priceIndex === 0 || priceIndex === prices.length) {
            // Can't interpolate. This should typically not happen as we try to include additional data points
            // for interpolation by our choice of _findTimestampChunk margins. However, this can still occur in
            // exceptional cases when the gap between two data points was larger than our margin or the requested
            // timestamp was before coingecko even started recording price data or is in the future.
            const priceEntry = prices[Math.min(priceIndex, prices.length - 1)];
            if (Math.abs(timestamp - priceEntry[0]) < 2 * ONE_DAY && timestamp <= now) {
                // Accept the single price entry's price if it's within a limit of 2 days and we're not making
                // assumptions about the future.
                result.set(timestamp, priceEntry[1]);
            }
        } else {
            // Interpolate between priceIndex-1 and priceIndex
            const predecessorEntry = prices[priceIndex - 1];
            const currentEntry = prices[priceIndex];
            const timeDelta = currentEntry[0] - predecessorEntry[0];
            if (timeDelta < 2 * ONE_DAY) {
                // accept the interpolation if timeDelta is within 2 days (typically should be 1 hour).
                const priceDelta = currentEntry[1] - predecessorEntry[1];
                const interpolatedPrice = predecessorEntry[1]
                    + priceDelta * ((timestamp - predecessorEntry[0]) / timeDelta);
                result.set(timestamp, interpolatedPrice);
            }
        }
        ++timestampIndex; // Continue with next timestamp and check same priceIndex
    }
    return result;
}

function _findTimestampChunk(
    timestamps: number[],
    searchStartIndex: number,
    maxChunkLength: number,
    timeMargin: number,
) {
    maxChunkLength -= 2 * timeMargin;
    const end = timestamps[searchStartIndex];
    let start = end;
    let i = searchStartIndex - 1;
    while (i >= 0 && end - timestamps[i] < maxChunkLength) {
        start = timestamps[i];
        --i;
    }
    return {
        searchEndIndex: i,
        chunk: {
            start: start - timeMargin,
            end: end + timeMargin,
        },
    };
}

async function _fetch(input: RequestInfo, init?: RequestInit): Promise<any> {
    let result: Response | null = null;
    do {
        let retry = true;
        try {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(input, init); // throws when user is offline
            if (!response.ok) {
                if (response.status === 400) {
                    retry = false;
                    throw new Error('400 - Bad request');
                }
                throw new Error(`Failed to fetch: ${response.status}. Retrying...`);
            }
            // eslint-disable-next-line no-await-in-loop
            result = await response.json();
        } catch (e) {
            // User might be offline or we ran into coingecko's rate limiting. Coingecko allows 100 requests
            // per minute and tells us in the response headers when our next minute starts, but unfortunately
            // due to cors we can not access this information. Therefore, we blindly retry after waiting some
            // time. Note that coingecko resets the quota solely based on their system time, i.e. independent
            // of when we resend our request. Therefore, we do not waste time/part of our quota by waiting a
            // bit longer. Note however, that we do not prioritize between our fetches, therefore they will
            // be resolved in random order.
            if (retry) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, 15000));
            } else {
                throw e;
            }
        }
    } while (!result);
    return result;
}
