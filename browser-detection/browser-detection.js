export default class BrowserDetection {

    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    }

    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}