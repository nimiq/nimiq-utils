declare class BrowserDetection {
    static getBrowserInfo(): {
        browser: BrowserDetection.Browser;
        version: BrowserDetection.BrowserVersion | null;
        isMobile: boolean;
    };
    static isMobile(): boolean;
    static detectBrowser(): BrowserDetection.Browser;
    static detectVersion(): BrowserDetection.BrowserVersion | null;
    static isChrome(): boolean;
    static isFirefox(): boolean;
    static isOpera(): boolean;
    static isEdge(): boolean;
    static isSafari(): boolean;
    static isBrave(): boolean;
    static isIOS(): boolean;
    static isBadIOS(): boolean | null;
    /**
     * Detect if the browser is running in Private Browsing mode
     *
     * @returns {Promise}
     */
    static isPrivateMode(): Promise<unknown>;
    private static _detectedBrowser?;
    private static _detectedVersion?;
}
declare namespace BrowserDetection {
    enum Browser {
        CHROME = "chrome",
        FIREFOX = "firefox",
        OPERA = "opera",
        EDGE = "edge",
        SAFARI = "safari",
        BRAVE = "brave",
        UNKNOWN = "unknown"
    }
    interface BrowserVersion {
        versionString: string;
        major: number;
        minor: number;
        build: number;
        patch: number;
    }
}
export default BrowserDetection;
