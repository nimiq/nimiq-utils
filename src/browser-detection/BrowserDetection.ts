class BrowserDetection {
    static getBrowserInfo() {
        return {
            browser: BrowserDetection.detectBrowser(),
            version: BrowserDetection.detectVersion(),
            isMobile: BrowserDetection.isMobile(),
        };
    }

    private static isBrowser(): boolean {
        return typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined';
    }

    /* eslint-disable max-len */
    // Also includes tablets.
    // Inspired by:
    // - https://stackoverflow.com/a/13819253
    // - https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Mobile_Tablet_or_Desktop
    // - http://detectmobilebrowsers.com/about (tablets)
    /* eslint-enable max-len */
    static isMobile() {
        if (!this.isBrowser()) return false;
        return /i?Phone|iP(ad|od)|Android|BlackBerry|Opera Mini|WPDesktop|Mobi(le)?|Silk/i.test(navigator.userAgent);
    }

    /* eslint-disable max-len */
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
    // - Safari iPhone: Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1
    // - Safari iPad: Mozilla/5.0 (iPad; CPU OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0 Mobile/15C202 Safari/604.1
    // - Brave: is indistinguishable from Chrome user agents
    /* eslint-enable max-len */
    static detectBrowser() {
        if (!this.isBrowser()) return BrowserDetection.Browser.UNKNOWN;
        if (BrowserDetection._detectedBrowser) {
            return BrowserDetection._detectedBrowser;
        }
        // note that the order is important as many browsers include the names of others in the ua.
        const ua = navigator.userAgent;
        if (/Edge\//i.test(ua)) {
            BrowserDetection._detectedBrowser = BrowserDetection.Browser.EDGE;
        } else if (/(Opera|OPR)\//i.test(ua)) {
            BrowserDetection._detectedBrowser = BrowserDetection.Browser.OPERA;
        } else if (/Firefox\//i.test(ua)) {
            BrowserDetection._detectedBrowser = BrowserDetection.Browser.FIREFOX;
        } else if (/Chrome\//i.test(ua)) {
            // Note that Brave is indistinguishable from Chrome by user agent. The additional check is taken from
            // https://stackoverflow.com/a/53799770. Unfortunately this distinction is not possible on mobile.
            BrowserDetection._detectedBrowser = (
                navigator.plugins.length === 0
                && navigator.mimeTypes.length === 0
                && !BrowserDetection.isMobile()
            )
                ? BrowserDetection.Browser.BRAVE
                : BrowserDetection.Browser.CHROME;
        } else if (/^((?!chrome|android).)*safari/i.test(ua)) {
            // see https://stackoverflow.com/a/23522755
            // Note that Chrome iOS is also detected as Safari, see comments in stack overflow
            BrowserDetection._detectedBrowser = BrowserDetection.Browser.SAFARI;
        } else {
            BrowserDetection._detectedBrowser = BrowserDetection.Browser.UNKNOWN;
        }
        return BrowserDetection._detectedBrowser;
    }

    static detectVersion() {
        if (!this.isBrowser()) return null;
        if (typeof BrowserDetection._detectedVersion !== 'undefined') {
            return BrowserDetection._detectedVersion;
        }
        let regex;
        switch (BrowserDetection.detectBrowser()) {
            case BrowserDetection.Browser.EDGE:
                regex = /Edge\/(\S+)/i;
                break;
            case BrowserDetection.Browser.OPERA:
                regex = /(Opera|OPR)\/(\S+)/i;
                break;
            case BrowserDetection.Browser.FIREFOX:
                regex = /Firefox\/(\S+)/i;
                break;
            case BrowserDetection.Browser.CHROME:
                regex = /Chrome\/(\S+)/i;
                break;
            case BrowserDetection.Browser.SAFARI:
                regex = /(iP(hone|ad|od).*?OS |Version\/)(\S+)/i;
                break;
            case BrowserDetection.Browser.BRAVE: // can't tell version for Brave
            default:
                BrowserDetection._detectedVersion = null;
                return null;
        }
        const match = navigator.userAgent.match(regex);
        if (!match) {
            BrowserDetection._detectedVersion = null;
            return null;
        }
        const versionString = match[match.length - 1].replace(/_/g, '.'); // replace _ in iOS version
        const versionParts = versionString.split('.');
        const parsedVersionParts = [];
        for (let i = 0; i < 4; ++i) {
            parsedVersionParts.push(parseInt(versionParts[i], 10) || 0);
        }
        const [major, minor, build, patch] = parsedVersionParts;
        BrowserDetection._detectedVersion = { versionString, major, minor, build, patch };
        return BrowserDetection._detectedVersion;
    }

    static isChrome() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.CHROME;
    }

    static isFirefox() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.FIREFOX;
    }

    static isOpera() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.OPERA;
    }

    static isEdge() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.EDGE;
    }

    static isSafari() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.SAFARI;
    }

    static isBrave() {
        if (!this.isBrowser()) return false;
        return BrowserDetection.detectBrowser() === BrowserDetection.Browser.BRAVE;
    }

    static isIOS() {
        if (!this.isBrowser()) return false;
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    static isBadIOS() {
        if (!this.isBrowser()) return false;
        const browserInfo = BrowserDetection.getBrowserInfo();
        // Check for iOS < 11 or 11.2 which has the WASM bug
        return browserInfo.browser === BrowserDetection.Browser.SAFARI
            && browserInfo.isMobile
            && browserInfo.version
            // eslint-disable-next-line no-mixed-operators
            && (browserInfo.version.major < 11 || browserInfo.version.major === 11 && browserInfo.version.minor === 2);
    }

    /**
     * Detect if the browser is running in Private Browsing mode
     *
     * @returns {Promise}
     */
    static isPrivateMode() {
        if (!this.isBrowser()) return Promise.resolve(false);
        return new Promise((resolve) => {
            const on = () => resolve(true); // is in private mode
            const off = () => resolve(false); // not private mode
            // using browser detection by feature detection here, also see https://stackoverflow.com/a/9851769
            // These seem to be partly outdated though. Might want to consider using user agent based detection.
            const isSafari = () => /Constructor/.test(window.HTMLElement)
                || (
                    window.safari
                    && window.safari.pushNotification
                    && window.safari.pushNotification.toString() === '[object SafariRemoteNotification]'
                );
            // Chrome & Opera
            if (window.webkitRequestFileSystem) {
                window.webkitRequestFileSystem(0, 0, off, on);
                return;
            }
            // Firefox
            if (document.documentElement && 'MozAppearance' in document.documentElement.style) {
                // @ts-ignore
                const db = indexedDB.open(null);
                db.onerror = on;
                db.onsuccess = off;
                return;
            }
            // Safari
            if (isSafari()) {
                try {
                    window.openDatabase(null, null, null, null);
                } catch (_) {
                    on();
                    return;
                }
            }
            // IE10+ & Edge
            if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
                on();
                return;
            }
            // others
            off();
        });
    }

    private static _detectedBrowser?: BrowserDetection.Browser;
    private static _detectedVersion?: BrowserDetection.BrowserVersion | null;
}

namespace BrowserDetection {
    export enum Browser {
        CHROME = 'chrome',
        FIREFOX = 'firefox',
        OPERA = 'opera',
        EDGE = 'edge',
        SAFARI = 'safari',
        BRAVE = 'brave',
        UNKNOWN = 'unknown',
    }

    export interface BrowserVersion {
        versionString: string;
        major: number;
        minor: number;
        build: number;
        patch: number;
    }
}

export default BrowserDetection;
