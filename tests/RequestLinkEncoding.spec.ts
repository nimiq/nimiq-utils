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

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(vector.link, undefined, true);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.message).toEqual(vector.message);
        }

        // Create links
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
            type: RequestLinkEncoding.NimiqRequestLinkType.URI,
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: undefined,
            message: undefined,
        }, {
            link: 'nimiq:NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S?amount=123.456',
            type: RequestLinkEncoding.NimiqRequestLinkType.URI,
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: undefined,
        }, {
            link: 'web+nim:NQ24458E67E1C90MC0XQ146BCE6RJMYRE27S?amount=123.456&message=Hello%20World!',
            type: RequestLinkEncoding.NimiqRequestLinkType.WEBURI,
            address: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
            amount: 123.456 * 1e5,
            message: 'Hello World!',
        }];

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(vector.link, undefined, true);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.message).toEqual(vector.message);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.NIM,
                amount: vector.amount,
                message: vector.message,
                type: vector.type,
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

        // Create links
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
        const address = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const vectors = [{
            link: `ethereum:${address}`,
            address,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `ethereum:${address}?uint256=2.014e18`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `ethereum:${address}?uint256=2.014e18&gasPrice=9e9`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `ethereum:${address}?uint256=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: undefined,
        }, {
            link: `ethereum:${address}@1?uint256=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}@5?uint256=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.ETHEREUM_GOERLI_TESTNET,
        }];

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.ETH,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
                chainId: vector.chainId,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create USDC on polygon request links', () => {
        const { SUPPORTED_TOKENS, ETHEREUM_CHAINS_ID, Currency } = RequestLinkEncoding;
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const mainnetUsdcContract = SUPPORTED_TOKENS[ETHEREUM_CHAINS_ID.POLYGON_MAINNET][Currency.USDC];
        const mumbaiUsdcContract = SUPPORTED_TOKENS[ETHEREUM_CHAINS_ID.POLYGON_MUMBAI_TESTNET][Currency.USDC];

        const vectors = [{
            link: `ethereum:${mainnetUsdcContract}@137/transfer?address=${recipientAddress}`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.POLYGON_MAINNET,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `ethereum:${mainnetUsdcContract}@137/transfer?uint256=2.014e6&address=${recipientAddress}`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.POLYGON_MAINNET,
            amount: BigInteger('2.014e6'),
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `ethereum:${mainnetUsdcContract}@137`
                + `/transfer?uint256=2.014e6&gasPrice=9e9&address=${recipientAddress}`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.POLYGON_MAINNET,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: undefined,
        }, {
            link: `ethereum:${mainnetUsdcContract}@137`
                + `/transfer?uint256=2.014e6&gasPrice=9e9&gasLimit=20000&address=${recipientAddress}`,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.POLYGON_MAINNET,
            address: recipientAddress,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }, {
            link: `ethereum:${mumbaiUsdcContract}@80001/transfer?uint256=2.014e6`
                + `&gasPrice=9e9&gasLimit=20000&address=${recipientAddress}`,
            chainId: RequestLinkEncoding.ETHEREUM_CHAINS_ID.POLYGON_MUMBAI_TESTNET,
            address: recipientAddress,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }];

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.USDC,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
                chainId: vector.chainId,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });
});
