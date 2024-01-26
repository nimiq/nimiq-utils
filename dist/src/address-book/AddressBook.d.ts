type BookType = {
    [k: string]: string;
};
export declare class AddressBook {
    static BOOK: BookType;
    static getLabel(address: string): string | null;
}
export {};
