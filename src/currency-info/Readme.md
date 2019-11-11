# CurrencyInfo

A data structure that provides information about a currency's currency code, symbol, name and decimals.


## new CurrencyInfo(currencyCode, decimals?, name?, symbol?)

### Parameters

| Parameter        | Type             | Description  
|------------------|------------------|------------
| **currencyCode** | string           | Three letter currency code only consisting of upper- or lowercase a-z.
| **decimals**     | number, optional | The currency specific number of decimal positions
| **name**         | string, optional | The currency's full name
| **symbol**       | string, optional | The currency symbol

For currencies listed in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) the values for omitted optional parameters can be determined automatically from the ISO 4217 currency code, if the browser supports it.
For other currency codes or when browser support is missing, `decimals` defaults to `2` and `name` and `symbol` to uppercase `currencyCode`.

Note that the automatically determined values can differ by different browser implementations. For example for the currency Afghani (AFN) which is nominally subdivided into 100 Puls which are however not actually in circulation, in Firefox `decimals` defaults to the nominal `2` decimals, while Chrome reports `0` decimals.

### Exceptions

Throws a [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) for invalid currency codes.


## Properties

| Property         | Type             | Description
|------------------|------------------|------------
| **currencyCode** | string, readonly | The currency's three letter code, normalized to uppercase
| **decimals**     | number, readonly | The currency specific number of decimal positions
| **name**         | string, readonly | The currency's full name
| **symbol**       | string, readonly | The currency's symbol


## Example

```ts
const euro = new CurrencyInfo('eur');
const btc = new CurrencyInfo('btc', 8, 'Bitcoin');

console.log(`1 ${euro.symbol} can be divided into ${10 ** euro.decimals} parts`);
console.log(`1 ${btc.symbol} can be divided into ${10 ** btc.decimals} parts`);
```
