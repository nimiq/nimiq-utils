import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: [
        'src/main',
        'src/address-book/AddressBook',
        'src/browser-detection/BrowserDetection',
        'src/currency-info/CurrencyInfo',
        'src/clipboard/Clipboard',
        'src/cookie/Cookie',
        'src/fiat-api/FiatApi',
        'src/formattable-number/FormattableNumber',
        'src/request-link-encoding/RequestLinkEncoding',
        'src/tweenable/Tweenable',
        'src/utf8-tools/Utf8Tools',
        'src/rate-limit-scheduler/RateLimitScheduler',
        'src/validation-utils/ValidationUtils',
        'src/rewards-calculator/rewards-calculator',
        'src/albatross-policy/albatross-policy',
        'src/supply-calculator/supply-calculator',
    ],
    declaration: true,
    rollup: {
        emitCJS: true,
    },
});
