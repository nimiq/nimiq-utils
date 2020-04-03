export class Cookie {
    public static setCookie(
        cookieName: string,
        cookieValue: string,
        options?: {
            expirationDays?: number,
            domain?: string,
        },
    ) {
        const cookie = [`${cookieName}=${cookieValue}`];

        if (options) {
            if (options.expirationDays) {
                cookie.push(`max-age=${options.expirationDays * 24 * 60 * 60}`);
            }
            if (options.domain) {
                cookie.push(`domain=${options.domain}`);
            }
        }

        cookie.push('path=/');

        const cookieString = cookie.join(';');
        document.cookie = cookieString;

        return cookieString;
    }

    public static getCookie(cookieName: string): string | null {
        const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
        return match && match[2];
    }
}
