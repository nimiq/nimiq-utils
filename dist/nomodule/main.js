'use strict';

var AddressBook = require('./AddressBook.js');
var BrowserDetection = require('./BrowserDetection.js');
var Clipboard = require('./Clipboard.js');
var Cookie = require('./Cookie-Q6uoJru9.js');
var CurrencyInfo = require('./CurrencyInfo.js');
var FiatApi = require('./FiatApi.js');
var FormattableNumber = require('./FormattableNumber.js');
var RequestLinkEncoding = require('./RequestLinkEncoding.js');
var Tweenable = require('./Tweenable.js');
var Utf8Tools = require('./Utf8Tools.js');
var ValidationUtils = require('./ValidationUtils.js');



exports.AddressBook = AddressBook.AddressBook;
exports.BrowserDetection = BrowserDetection;
exports.Clipboard = Clipboard.Clipboard;
exports.Cookie = Cookie.Cookie;
exports.CurrencyInfo = CurrencyInfo.CurrencyInfo;
Object.defineProperty(exports, "FiatApiBridgedFiatCurrency", {
	enumerable: true,
	get: function () { return FiatApi.FiatApiBridgedFiatCurrency; }
});
Object.defineProperty(exports, "FiatApiSupportedCryptoCurrency", {
	enumerable: true,
	get: function () { return FiatApi.FiatApiSupportedCryptoCurrency; }
});
Object.defineProperty(exports, "FiatApiSupportedFiatCurrency", {
	enumerable: true,
	get: function () { return FiatApi.FiatApiSupportedFiatCurrency; }
});
exports.getExchangeRates = FiatApi.getExchangeRates;
exports.getHistoricExchangeRates = FiatApi.getHistoricExchangeRates;
exports.getHistoricExchangeRatesByRange = FiatApi.getHistoricExchangeRatesByRange;
exports.FormattableNumber = FormattableNumber.FormattableNumber;
exports.toNonScientificNumberString = FormattableNumber.toNonScientificNumberString;
Object.defineProperty(exports, "Currency", {
	enumerable: true,
	get: function () { return RequestLinkEncoding.Currency; }
});
exports.ETHEREUM_SUPPORTED_CONTRACTS = RequestLinkEncoding.ETHEREUM_SUPPORTED_CONTRACTS;
exports.ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP = RequestLinkEncoding.ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP;
exports.ETHEREUM_SUPPORTED_NATIVE_CURRENCIES = RequestLinkEncoding.ETHEREUM_SUPPORTED_NATIVE_CURRENCIES;
Object.defineProperty(exports, "EthereumChain", {
	enumerable: true,
	get: function () { return RequestLinkEncoding.EthereumChain; }
});
Object.defineProperty(exports, "NimiqRequestLinkType", {
	enumerable: true,
	get: function () { return RequestLinkEncoding.NimiqRequestLinkType; }
});
exports.createBitcoinRequestLink = RequestLinkEncoding.createBitcoinRequestLink;
exports.createEthereumRequestLink = RequestLinkEncoding.createEthereumRequestLink;
exports.createNimiqRequestLink = RequestLinkEncoding.createNimiqRequestLink;
exports.createRequestLink = RequestLinkEncoding.createRequestLink;
exports.parseBitcoinRequestLink = RequestLinkEncoding.parseBitcoinRequestLink;
exports.parseEthereumRequestLink = RequestLinkEncoding.parseEthereumRequestLink;
exports.parseNimiqSafeRequestLink = RequestLinkEncoding.parseNimiqSafeRequestLink;
exports.parseNimiqUriRequestLink = RequestLinkEncoding.parseNimiqUriRequestLink;
exports.parseRequestLink = RequestLinkEncoding.parseRequestLink;
exports.Tweenable = Tweenable;
exports.Utf8Tools = Utf8Tools.Utf8Tools;
exports.ValidationUtils = ValidationUtils.ValidationUtils;
//# sourceMappingURL=main.js.map
