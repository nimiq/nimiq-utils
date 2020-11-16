// rollup.config.js
export default {
    // list source files here to ensure they get bundled and not removed by tree-shaking.
    input: [
        'build/main.js',
        'build/address-book/AddressBook.js',
        'build/browser-detection/BrowserDetection.js',
        'build/currency-info/CurrencyInfo.js',
        'build/clipboard/Clipboard.js',
        'build/cookie/Cookie.js',
        'build/fiat-api/FiatApi.js',
        'build/formattable-number/FormattableNumber.js',
        'build/request-link-encoding/RequestLinkEncoding.js',
        'build/tweenable/Tweenable.js',
        'build/utf8-tools/Utf8Tools.js',
        'build/validation-utils/ValidationUtils.js'
    ],
    output: [
        {
            dir: 'dist/module',
            format: "es",
            sourcemap: true
        },
        {
            dir: 'dist/nomodule',
            format: 'cjs',
            sourcemap: true
        }
    ],
    experimentalCodeSplitting: true
};
