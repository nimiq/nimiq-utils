export class Cookie {
    /**
     * Get a Cookie
     * @param {string} cookieName - The name / key of the Cookie to get.
     * @returns {string|null} Returns the value of the Cookie, if this one was found. Otherwise return null.
     */
    public static getCookie(cookieName: string): string | null {
        const match = document.cookie.match(new RegExp(`(^| )${encodeURIComponent(cookieName)}=([^;]+)`));
        return match && decodeURIComponent(match[2]);
    }

    /**
     * Set a Cookie
     * @param {string} cookieName - Name of the Cookie to set.
     * @param {string} cookieValue - Value of the Cookie to set.
     * @param {Object} [options] - The differents options you can set on a cookie.
     * @param {string} [options.path] - The path of the Cookie.
     * If not specified, defaults to the current path of the current document location
     * @param {string} [options.domain] - The domain the Cookie will be available on.
     * If not specified, this defaults to the host portion of the current document location.
     * @param {number} [options.maxAge] - The max age of the Cookie in seconds
     * @param {number} [options.expires] - The expiration date of the Cookie, in GMTString format.
     * See Date.toUTCString() for help formatting this value.
     * @param {boolean} [options.secure] - This specify if the Cookie is only to be transmitted over secure protocols.
     * @param {'lax'|'strict'} [options.samesite] - This prevents the browser from sending this Cookie along with
     * cross-site requests.
     */
    public static setCookie(
        cookieName: string,
        cookieValue: string,
        options?: {
            path?: string,
            domain?: string,
            maxAge?: number,
            secure?: boolean,
            expires?: string,
            samesite?: 'lax'|'strict',
        },
    ) {
        const cookie = [`${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`];

        if (options) {
            if (options.path) cookie.push(`path=${options.path}`);
            if (options.secure) cookie.push('secure');
            if (options.domain) cookie.push(`domain=${options.domain}`);
            if (options.maxAge) cookie.push(`max-age=${options.maxAge}`);
            if (options.expires) cookie.push(`expires=${options.expires}`);
            if (options.samesite) cookie.push(`samesite=${options.samesite}`);
        }

        document.cookie = cookie.join(';');
    }

    /**
     * Unset a Cookie (remove it)
     * @param {string} cookieName - the Name / Key of the Cookie to be unset / removed
     */
    public static unsetCookie(cookieName: string) {
        document.cookie = `${encodeURIComponent(cookieName)}=;max-age=0`;
    }
}
