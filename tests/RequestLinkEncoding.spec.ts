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
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.NIM] },
            );
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
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.NIM] },
            );
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

    it('can parse and create BTC request links', () => {
        const vectors = [{
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: undefined,
            fee: undefined,
            message: undefined,
            label: undefined,
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?label=Luke-Jr',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: undefined,
            fee: undefined,
            message: undefined,
            label: 'Luke-Jr',
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=20.3&label=Luke-Jr',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: 20.3 * 1e8,
            fee: undefined,
            message: undefined,
            label: 'Luke-Jr',
        }, {
            link: 'bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=50&fee=0.0123&label=Luke-Jr'
                + '&message=Donation%20for%20project%20xyz',
            address: '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
            amount: 50 * 1e8,
            fee: 0.0123 * 1e8,
            message: 'Donation for project xyz',
            label: 'Luke-Jr',
        }];

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.BTC] },
            );
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.fee).toEqual(vector.fee);
            expect(parsed!.label).toEqual(vector.label);
            expect(parsed!.message).toEqual(vector.message);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.BTC,
                amount: vector.amount,
                fee: vector.fee,
                message: vector.message,
                label: vector.label,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create native ETH request links', () => {
        const address = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const vectors = [{
            link: `ethereum:${address}`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `ethereum:${address}?value=2.014e18`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}@5?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.ETH,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
        }] as const;

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: vector.currency,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
                chainId: vector.chainId,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create USDC on ETH request links', () => {
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const usdcMainAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
        const usdcGoerliAddress = '0xde637d4c445ca2aae8f782ffac8d2971b93a4998';
        const vectors = [{
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`,
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${usdcGoerliAddress}@5/transfer?address=${recipientAddress}`,
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}&uint256=2014000000000e6`,
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9',
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9&gasLimit=20000',
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${usdcGoerliAddress}@5/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9&gasLimit=20000',
            amount: BigInteger('2.014e18'),
            currency: RequestLinkEncoding.Currency.USDC,
            recipientAddress,
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
        }] as const;

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: vector.currency,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
                chainId: vector.chainId,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.recipientAddress, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create native Polygon request links', () => {
        const address = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const vectors = [{
            link: `polygon:${address}`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `polygon:${address}@137?value=2.014e18`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@80001?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            currency: RequestLinkEncoding.Currency.MATIC,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MUMBAI_TESTNET,
        }] as const;

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: vector.currency,
                amount: vector.amount,
                gasPrice: vector.gasPrice,
                gasLimit: vector.gasLimit,
                chainId: vector.chainId,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create USDC on Polygon request links', () => {
        const { ETHEREUM_SUPPORTED_TOKENS, EthereumChain, Currency } = RequestLinkEncoding;
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const mainnetUsdcContract = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.POLYGON_MAINNET][Currency.USDC];
        const mumbaiUsdcContract = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.POLYGON_MUMBAI_TESTNET][Currency.USDC];

        const vectors = [{
            link: `polygon:${mainnetUsdcContract}@137/transfer?address=${recipientAddress}`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137/transfer?address=${recipientAddress}&uint256=2.014e6`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            amount: BigInteger('2.014e6'),
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137`
                + `/transfer?address=${recipientAddress}&uint256=2.014e6&gasPrice=9e9`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137`
                + `/transfer?address=${recipientAddress}&uint256=2.014e6&gasPrice=9e9&gasLimit=20000`,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            address: recipientAddress,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }, {
            link: `polygon:${mumbaiUsdcContract}@80001/transfer?address=${recipientAddress}&uint256=2.014e6`
                + '&gasPrice=9e9&gasLimit=20000',
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MUMBAI_TESTNET,
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

    it('should throw error due to bad arguments', () => {
        expect(() => RequestLinkEncoding.createRequestLink('', {
            currency: RequestLinkEncoding.Currency.ETH,
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Recipient is required');

        expect(() => RequestLinkEncoding.createRequestLink('0x123', {
            currency: 'UnkonwnToken' as unknown as RequestLinkEncoding.Currency,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Unsupported currency');

        expect(() => RequestLinkEncoding.createRequestLink('0x123', {
            currency: RequestLinkEncoding.Currency.ETH,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Invalid recipient address');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: RequestLinkEncoding.Currency.ETH,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: '0x123',
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Invalid contract address');
    });
});
