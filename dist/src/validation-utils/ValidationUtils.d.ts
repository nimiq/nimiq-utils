export declare class ValidationUtils {
    static isValidAddress(address: string): boolean;
    static normalizeAddress(address: string): string;
    static isUserFriendlyAddress(str: string): void;
    static _alphabetCheck(str: string): boolean;
    static _ibanCheck(str: string): number;
    static isValidHash(hash: string): boolean;
    static get NIMIQ_ALPHABET(): string;
}
