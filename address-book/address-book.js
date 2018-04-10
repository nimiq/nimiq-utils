export default class AddressBook {
    static getLabel(address) {
        return AddressBook.BOOK[address] || null;
    }
}

AddressBook.BOOK = {
    'NQ92 0RGS 0YGB MRY8 5MHM MBL2 HSP5 7N0U Y5C6': 'pool.nimiq.watch'
}
