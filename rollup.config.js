// rollup.config.js
export default {
    // list source files here to ensure they get bundled and not removed by tree-shaking.
    input: [
        'dist/main.js',
        'dist/address-book/AddressBook.js',
        'dist/browser-detection/BrowserDetection.js',
        'dist/currency-info/CurrencyInfo.js',
        'dist/clipboard/Clipboard.js',
        'dist/cookie/Cookie.js',
        'dist/fiat-api/FiatApi.js',
        'dist/formattable-number/FormattableNumber.js',
        'dist/request-link-encoding/RequestLinkEncoding.js',
        'dist/tweenable/Tweenable.js',
        'dist/utf8-tools/Utf8Tools.js',
        'dist/validation-utils/ValidationUtils.js'
    ],
    output: [
        {
            dir: 'dist/nomodule',
            format: 'cjs',
            sourcemap: true
        }
    ],
    experimentalCodeSplitting: true
};
