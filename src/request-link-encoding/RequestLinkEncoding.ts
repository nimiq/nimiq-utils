import { ValidationUtils } from "../validation-utils/ValidationUtils";

// Note that the encoding scheme is the same as for Safe XRouter aside route parameters (see _makeAside).
export function createRequestLink(
    recipient: string,
    amount?: number, // in NIM
    message?: string,
    basePath: string = window.location.host,
) {
    if (!ValidationUtils.isValidAddress(recipient)) throw new Error(`Not a valid address: ${recipient}`);
    if (amount && typeof amount !== 'number') throw new Error(`Not a valid amount: ${amount}`);
    if (message && typeof message !== 'string') throw new Error(`Not a valid message: ${message}`);
    const params = [
        recipient.replace(/ /g, ''), // strip spaces
        amount || '',
        encodeURIComponent(message || '')
    ];
    // don't encode empty params (if they are not followed by other non-empty params)
    while (params[params.length - 1] === '') params.pop();

    if (!basePath.endsWith('/')) basePath = `${basePath}/`;

    return `${basePath}#_request/${params.join('/')}_`;
}

export function parseRequestLink(
    requestLink: string | URL,
    requiredBasePath?: string,
) {
    if (!(requestLink instanceof URL)) {
        try {
            if (!requestLink.includes('://')) {
                // Because we are only interested in the host and hash, the protocol doesn't matter
                requestLink = 'dummy://' + requestLink;
            }
            requestLink = new URL(requestLink);
        } catch(e) {
            return null;
        }
    }
    if (requiredBasePath && requestLink.host !== requiredBasePath) return null;

    // check whether it's a request link
    const requestRegex = /_request\/(([^/]+)(\/[^/]*){0,2})_/;
    const requestRegexMatch = requestLink.hash.match(requestRegex);
    if (!requestRegexMatch) return null;

    // parse params
    const paramsSubstr = requestRegexMatch[1];
    let [recipient, amount, message] = paramsSubstr.split('/');

    // check params
    recipient = recipient
        .replace(/[ +-]|%20/g, '') // strip spaces and dashes
        .replace(/(.)(?=(.{4})+$)/g, '$1 '); // reformat with spaces, forming blocks of 4 chars
    if (!ValidationUtils.isValidAddress(recipient)) return null; // recipient is required

    let parsedAmount;
    if (typeof amount !== 'undefined' && amount !== '') {
        parsedAmount = parseFloat(amount);
        if (Number.isNaN(parsedAmount)) return null;
    } else {
        parsedAmount = null;
    }

    let parsedMessage;
    if (typeof message !== 'undefined' && message !== '') {
        parsedMessage = decodeURIComponent(message) ;
    } else {
        parsedMessage = null;
    }
    return { recipient, amount: parsedAmount, message: parsedMessage };
}
