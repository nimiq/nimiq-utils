/* global describe, it, expect */

import BigInteger from 'big-integer';
import * as RequestLinkEncoding from '../src/request-link-encoding/RequestLinkEncoding';

describe('RequestLinkEncoding', () => {
    it('can parse and create NIM Safe request links', () => {
        const vectors = [{
            link: 'https://safe.nimiq.com/#_request/NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S_',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: undefined,
            message: undefined,
        }, {
            link: 'https://safe.nimiq.com/#_request/NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S/123.456_',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: undefined,
        }, {
            link: 'https://safe.nimiq.com/#_request/NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S/123.456/Hello%20World!_',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: 'Hello World!',
        }];

        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(vector.link, undefined, true);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.message).toEqual(vector.message);
        }

        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.NIM,
                amount: vector.amount,
                message: vector.message,
                basePath: 'https://safe.nimiq.com',
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create NIM URI request links', () => {
        const vectors = [{
            link: 'nimiq:NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: undefined,
            message: undefined,
        }, {
            link: 'nimiq:NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S?amount=123.456',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: undefined,
        }, {
            link: 'nimiq:NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S?amount=123.456&message=Hello%20World!',
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: 'Hello World!',
        }];

        // for (const vector of vectors) {
        //     const parsed = RequestLinkEncoding.parseRequestLink(vector.link, undefined, true);
        //     expect(parsed!.recipient).toEqual(vector.address);
        //     expect(parsed!.amount).toEqual(vector.amount);
        //     expect(parsed!.message).toEqual(vector.message);
        // }

        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.NIM,
                amount: vector.amount,
                message: vector.message,
                type: RequestLinkEncoding.NimiqRequestLinkType.URI,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create BTC request links', () => {
        const vectors = [{
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: undefined,
            message: undefined,
            label: undefined,
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?label=Luke-Jr',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: undefined,
            message: undefined,
            label: 'Luke-Jr',
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=20.3&label=Luke-Jr',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: 20.3 * 1e8,
            message: undefined,
            label: 'Luke-Jr',
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=50&label=Luke-Jr'
                + '&message=Donation%20for%20project%20xyz',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: 50 * 1e8,
            message: 'Donation for project xyz',
            label: 'Luke-Jr',
        }];

        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.BTC,
                amount: vector.amount,
                message: vector.message,
                label: vector.label,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create ETH request links', () => {
        const vectors = [{
            link: 'ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359',
            address: '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359',
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: 'ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359?value=2.014e18',
            address: '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359',
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: 'ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359?value=2.014e18&gasPrice=9e9',
            address: '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359',
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
        }, {
            link: 'ethereum:0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359?value=2.014e18&gasLimit=20000&gasPrice=9e9',
            address: '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359',
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }];

        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.ETH,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });
});
