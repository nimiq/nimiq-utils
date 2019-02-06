class BrowserDetection {
    // Also includes tablets.
    // Inspired by:
    // - https://stackoverflow.com/a/13819253
    // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Mobile_Tablet_or_Desktop
    // - http://detectmobilebrowsers.com/about (tablets)
    static isMobile() {
        return /i?Phone|iP(ad|od)|Android|BlackBerry|Opera Mini|WPDesktop|Mobi(le)?|Silk/i.test(navigator.userAgent);
    }

    // Browser tests inspired by:
    // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Browser_Name
    // - https://stackoverflow.com/a/26358856 (order is important)
    // Note that also this approach is very interesting: https://stackoverflow.com/a/40246491
    //
    // The following page is a great overview of example user agent strings:
    // http://www.useragentstring.com/pages/useragentstring.php?name=All
    // Example user agents:
    // - Edge: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14931
    // - Opera: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36 OPR/34.0.2036.42
    // - Firefox: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:64.0) Gecko/20100101 Firefox/64.0
    // - Chrome: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36
    // - Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A
    static getBrowser() {
        const ua = navigator.userAgent;
        // note that the order is important as many browsers include the names of others in the ua.
        if (/Edge\//i.test(ua)) {
            return BrowserDetection.Browser.EDGE;
        } else if (/(Opera|OPR)\//i.test(ua)) {
            return BrowserDetection.Browser.OPERA;
        } else if (/Firefox\//i.test(ua)) {
            return BrowserDetection.Browser.FIREFOX;
        } else if (/Chrome\//i.test(ua)) {
            return BrowserDetection.Browser.CHROME;
        } else if (/^((?!chrome|android).)*safari/i.test(ua)) {
            // see https://stackoverflow.com/a/23522755
            // Note that Chrome iOS is also detected as Safari, see comments in stack overflow
            return BrowserDetection.Browser.SAFARI;
        } else {
            return BrowserDetection.Browser.UNKNOWN;
        }
    }

    static isChrome() {
        return BrowserDetection.getBrowser() === BrowserDetection.Browser.CHROME;
    }

    static isFirefox() {
        return BrowserDetection.getBrowser() === BrowserDetection.Browser.FIREFOX;
    }

    static isOpera() {
        return BrowserDetection.getBrowser() === BrowserDetection.Browser.OPERA;
    }

    static isEdge() {
        return BrowserDetection.getBrowser() === BrowserDetection.Browser.EDGE;
    }

    static isSafari() {
        return BrowserDetection.getBrowser() === BrowserDetection.Browser.SAFARI;
    }

    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    static iOSversion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v![1], 10), parseInt(v![2], 10), parseInt(v![3] || '0', 10)];
        }
    }

    static isBadIOS() {
        const version = this.iOSversion();
        return version && version![0] < 11 || (version![0] === 11 && version![1] === 2) // Only 11.2 has the WASM bug
    }

    /**
     * Detect if the browser is running in Private Browsing mode
     *
     * @returns {Promise}
     */
    static isPrivateMode() {
        return new Promise((resolve) => {
            const on = () => { resolve(true) }; // is in private mode
            const off = () => { resolve(false) }; // not private mode
            // using browser detection by feature detection here, also see https://stackoverflow.com/a/9851769
            // These seem to be partly outdated though. Might want to consider using user agent based detection.
            const isSafari = () => {
                return (
                    /Constructor/.test(window.HTMLElement) ||
                    (function (root) {
                            return (!root || root.pushNotification).toString() === '[object SafariRemoteNotification]';
                        }
                    )(window.safari)
                );
            };
            // Chrome & Opera
            if (window.webkitRequestFileSystem) {
                return void window.webkitRequestFileSystem(0, 0, off, on);
            }
            // Firefox
            if (document.documentElement && 'MozAppearance' in document.documentElement.style) {
                // @ts-ignore
                const db = indexedDB.open(null);
                db.onerror = on;
                db.onsuccess = off;
                return void 0;
            }
            // Safari
            if ( isSafari() ) {
                try {
                    window.openDatabase(null, null, null, null);
                } catch (_) {
                    return on();
                }
            }
            // IE10+ & Edge
            if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
                return on();
            }
            // others
            return off();
        });
    }
}

namespace BrowserDetection {
    export const enum Browser {
        CHROME = 'chrome',
        FIREFOX = 'firefox',
        OPERA = 'opera',
        EDGE = 'edge',
        SAFARI = 'safari',
        UNKNOWN = 'unknown',
    }
}

export default BrowserDetection;
