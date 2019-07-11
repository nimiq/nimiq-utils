// rollup.config.js
export default {
    input: [
        'build/main.js',
        'build/address-book/AddressBook.js',
        'build/browser-detection/BrowserDetection.js',
        'build/request-link-encoding/RequestLinkEncoding.js',
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
