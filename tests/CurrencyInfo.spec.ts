/* global describe, it */

import { CurrencyInfo } from '../src/currency-info/CurrencyInfo';
import { FiatApiSupportedFiatCurrency } from '../src/fiat-api/FiatApi';

describe('CurrencyInfo', () => {
    it('has currency symbols', () => {
        for (const code of Object.keys(FiatApiSupportedFiatCurrency)) {
            const info = new CurrencyInfo(code);
            console.log(code, info.symbol); // eslint-disable-line no-console
        }
    });
});
