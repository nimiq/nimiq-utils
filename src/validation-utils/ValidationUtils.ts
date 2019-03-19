export class ValidationUtils {
    static isValidAddress(address: string) {
        if (!address) return false;
        try {
            this.isUserFriendlyAddress(address);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Copied from: https://github.com/nimiq-network/core/blob/master/src/main/generic/consensus/base/account/Address.js

    static isUserFriendlyAddress(str: string) {
        if (!str) return;
        str = str.replace(/ /g, '');

        if (str.substr(0, 2).toUpperCase() !== 'NQ') {
            throw new Error('Addresses start with NQ');
        }

        if (str.length !== 36) {
            throw new Error('Addresses are 36 chars (ignoring spaces)');
        }

        if (!this._alphabetCheck(str)) {
            throw new Error('Address has invalid characters');
        }

        if (this._ibanCheck(str.substr(4) + str.substr(0, 4)) !== 1) {
            throw new Error('Address Checksum invalid');
        }
    }

    static _alphabetCheck(str: string) {
        str = str.toUpperCase();
        for (let i = 0; i < str.length; i++) {
            if (!ValidationUtils.NIMIQ_ALPHABET.includes(str[i])) return false;
        }
        return true;
    }

    static _ibanCheck(str: string) {
        const num = str.split('').map((c) => {
            const code = c.toUpperCase().charCodeAt(0);
            return code >= 48 && code <= 57 ? c : (code - 55).toString();
        }).join('');
        let tmp = '';

        for (let i = 0; i < Math.ceil(num.length / 6); i++) {
            tmp = (parseInt(tmp + num.substr(i * 6, 6)) % 97).toString();
        }

        return parseInt(tmp);
    }

    static isValidHash(hash: string) {
        // not using Nimiq Api here to don't require it to be loaded already
        try {
            return atob(hash).length === 32;
        } catch(e) {
            return false;
        }
    }

    static get NIMIQ_ALPHABET() {
        // From Nimiq.BufferUtils.BASE32_ALPHABET.NIMIQ
        return '0123456789ABCDEFGHJKLMNPQRSTUVXY';
    }
}
