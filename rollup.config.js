// rollup.config.js
export default {
    input: [
        'build/main.js',
        'build/address-book/AddressBook.js',
        'build/browser-detection/BrowserDetection.js',
        // 'src/input-format/InputFormat.js',
        'build/paste-handler/PasteHandler.js',
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
