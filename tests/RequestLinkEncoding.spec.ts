/* eslint-disable spaced-comment */
/// <reference lib="es2017" />
/// <reference lib="esnext.bigint" />
/* eslint-enable spaced-comment */

/* global describe, it, expect */

import BigInteger from 'big-integer';
import * as RequestLinkEncoding from '../src/request-link-encoding/RequestLinkEncoding';
import { toNonScientificNumberString } from '../src/formattable-number/FormattableNumber';

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
                basePath: 'https://safe.nimiq.com',
                ...vector,
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
                ...vector,
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
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create native ETH request links', () => {
        const address = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const vectors = [{
            link: `ethereum:${address}`,
            address,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `ethereum:${address}?value=2.014e18`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        }, {
            link: `ethereum:${address}@5?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
        }] as const;

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.ETH] },
            );
            expect(parsed!.currency).toEqual(RequestLinkEncoding.Currency.ETH);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount ? BigInteger(parsed!.amount.toString()) : undefined).toEqual(vector.amount);
            expect(parsed!.gasPrice).toEqual(vector.gasPrice);
            expect(parsed!.gasLimit).toEqual(vector.gasLimit);
            // Chain id in native ETH request links is only encoded in link if it's not the ethereum main chain.
            expect(parsed!.chainId || RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET)
                .toEqual(vector.chainId || RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET);
            expect(parsed!.contractAddress).toEqual(undefined);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.ETH,
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create USDC on ETH request links', () => {
        const { ETHEREUM_SUPPORTED_TOKENS, EthereumChain, Currency } = RequestLinkEncoding;
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const usdcMainAddress = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.ETHEREUM_MAINNET][Currency.USDC];
        const usdcGoerliAddress = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.ETHEREUM_GOERLI_TESTNET][Currency.USDC];
        const vectors = [{
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`,
            recipientAddress,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: usdcMainAddress,
        }, {
            link: `ethereum:${usdcGoerliAddress}@5/transfer?address=${recipientAddress}`,
            recipientAddress,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
            contractAddress: usdcGoerliAddress,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}&uint256=2014000000000e6`,
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: usdcMainAddress,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9',
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: usdcMainAddress,
        }, {
            link: `ethereum:${usdcMainAddress}/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9&gasLimit=20000',
            recipientAddress,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: usdcMainAddress,
        }, {
            link: `ethereum:${usdcGoerliAddress}@5/transfer?address=${recipientAddress}`
                + '&uint256=2014000000000e6&gasPrice=9e9&gasLimit=20000',
            amount: BigInteger('2.014e18'),
            recipientAddress,
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET,
            contractAddress: usdcGoerliAddress,
        }] as const;

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.USDC] },
            );
            expect(parsed!.currency).toEqual(RequestLinkEncoding.Currency.USDC);
            expect(parsed!.recipient).toEqual(vector.recipientAddress);
            expect(parsed!.amount ? BigInteger(parsed!.amount.toString()) : undefined).toEqual(vector.amount);
            expect(parsed!.gasPrice).toEqual(vector.gasPrice);
            expect(parsed!.gasLimit).toEqual(vector.gasLimit);
            expect(parsed!.chainId).toEqual(vector.chainId);
            expect(parsed!.contractAddress).toEqual(vector.contractAddress);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.USDC,
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.recipientAddress, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create native Polygon request links', () => {
        const address = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const vectors = [{
            link: `polygon:${address}`,
            address,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: undefined,
        }, {
            link: `polygon:${address}@137?value=2.014e18`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: undefined,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: undefined,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@137?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
        }, {
            link: `polygon:${address}@80001?value=2.014e18&gasPrice=9e9&gasLimit=20000`,
            address,
            amount: BigInteger('2.014e18'),
            gasPrice: 9e9,
            gasLimit: 2e4,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MUMBAI_TESTNET,
        }] as const;

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.MATIC] },
            );
            expect(parsed!.currency).toEqual(RequestLinkEncoding.Currency.MATIC);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount ? BigInteger(parsed!.amount.toString()) : undefined).toEqual(vector.amount);
            expect(parsed!.gasPrice).toEqual(vector.gasPrice);
            expect(parsed!.gasLimit).toEqual(vector.gasLimit);
            expect(parsed!.chainId).toEqual(vector.chainId || RequestLinkEncoding.EthereumChain.POLYGON_MAINNET);
            expect(parsed!.contractAddress).toEqual(undefined);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.MATIC,
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create USDC on Polygon request links', () => {
        const { ETHEREUM_SUPPORTED_TOKENS, EthereumChain, Currency } = RequestLinkEncoding;
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const mainnetUsdcContract = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.POLYGON_MAINNET][Currency.USDC];
        const mumbaiUsdcContract = ETHEREUM_SUPPORTED_TOKENS[EthereumChain.POLYGON_MUMBAI_TESTNET][Currency.USDC];

        const vectors = [{
            link: `polygon:${mainnetUsdcContract}/transfer?address=${recipientAddress}`,
            address: recipientAddress,
            chainId: undefined,
            contractAddress: mainnetUsdcContract,
            amount: undefined,
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137/transfer?address=${recipientAddress}&uint256=2.014e6`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            contractAddress: mainnetUsdcContract,
            amount: BigInteger('2.014e6'),
            gasPrice: undefined,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137`
                + `/transfer?address=${recipientAddress}&uint256=2.014e6&gasPrice=9e9`,
            address: recipientAddress,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            contractAddress: mainnetUsdcContract,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: undefined,
        }, {
            link: `polygon:${mainnetUsdcContract}@137`
                + `/transfer?address=${recipientAddress}&uint256=2.014e6&gasPrice=9e9&gasLimit=20000`,
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MAINNET,
            contractAddress: mainnetUsdcContract,
            address: recipientAddress,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }, {
            link: `polygon:${mumbaiUsdcContract}@80001/transfer?address=${recipientAddress}&uint256=2.014e6`
                + '&gasPrice=9e9&gasLimit=20000',
            chainId: RequestLinkEncoding.EthereumChain.POLYGON_MUMBAI_TESTNET,
            contractAddress: mumbaiUsdcContract,
            address: recipientAddress,
            amount: BigInteger('2.014e6'),
            gasPrice: 9e9,
            gasLimit: 2e4,
        }];

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                { currencies: [RequestLinkEncoding.Currency.USDC] },
            );
            expect(parsed!.currency).toEqual(RequestLinkEncoding.Currency.USDC);
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount ? BigInteger(parsed!.amount.toString()) : undefined).toEqual(vector.amount);
            expect(parsed!.gasPrice).toEqual(vector.gasPrice);
            expect(parsed!.gasLimit).toEqual(vector.gasLimit);
            expect(parsed!.chainId).toEqual(vector.chainId || RequestLinkEncoding.EthereumChain.POLYGON_MAINNET);
            expect(parsed!.contractAddress).toEqual(vector.contractAddress);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: RequestLinkEncoding.Currency.USDC,
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can create request links with custom chainId or contractAddress', () => {
        const { ETHEREUM_SUPPORTED_TOKENS_REVERSE_LOOKUP, EthereumChain, Currency } = RequestLinkEncoding;
        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const customChainId = 123;
        const knownChainIds = Object.values(EthereumChain)
            .filter((value) => typeof value === 'number') as number[]; // filter out enum reverse mappings
        const customContractAddress = '0x0123456789012345678901234567890123456789';
        const knownContracts = Object.keys(ETHEREUM_SUPPORTED_TOKENS_REVERSE_LOOKUP);

        // Note: the test samples will include tests for known contract addresses on the "wrong" chain and chain ids for
        // a mismatching currency, but that doesn't matter here.
        for (const currency of [Currency.ETH, Currency.MATIC, Currency.USDC] as const) {
            for (const chainId of [undefined, ...knownChainIds, customChainId]) {
                for (const contractAddress of [undefined, ...knownContracts, customContractAddress]) {
                    if (chainId !== customChainId && contractAddress !== customContractAddress) {
                        // Test vectors should include at least one custom component.
                        continue; // eslint-disable-line no-continue
                    }
                    for (const amount of [undefined, `2.014e${currency !== Currency.USDC ? 18 : 6}`]) {
                        for (const gasPrice of [undefined, '9e9']) {
                            for (const gasLimit of [undefined, 100000]) {
                                const options = {
                                    currency,
                                    /* eslint-disable no-undef */
                                    amount: amount ? BigInt(toNonScientificNumberString(amount)) : undefined,
                                    gasPrice: gasPrice ? BigInt(toNonScientificNumberString(gasPrice)) : undefined,
                                    /* eslint-enable no-undef */
                                    gasLimit,
                                    chainId,
                                    contractAddress,
                                };
                                if (currency === Currency.USDC && !contractAddress) {
                                    // For contract currencies on a custom chain id, the contract address is required.
                                    expect(() => RequestLinkEncoding.createRequestLink(recipientAddress, options))
                                        .toThrowError('Unsupported chainId: 123. You need to specify the '
                                            + '\'contractAddress\' option');
                                } else {
                                    const [contractChainId] = ETHEREUM_SUPPORTED_TOKENS_REVERSE_LOOKUP[
                                        contractAddress || ''] || [null];
                                    const chainName = EthereumChain[chainId || -1]
                                        || EthereumChain[contractChainId || -1] || '';
                                    const protocol = /^ethereum/i.test(chainName) ? 'ethereum:'
                                        : /^polygon/i.test(chainName) ? 'polygon:'
                                            : currency === Currency.MATIC ? 'polygon:'
                                                : 'ethereum:';
                                    const targetAddress = contractAddress || recipientAddress;
                                    const chainIdPart = chainId && chainId !== EthereumChain.ETHEREUM_MAINNET
                                        ? `@${chainId}`
                                        : '';
                                    const functionPart = contractAddress ? '/transfer' : '';
                                    const query = new URLSearchParams();
                                    if (contractAddress) query.set('address', recipientAddress);
                                    if (amount) query.set(contractAddress ? 'uint256' : 'value', amount);
                                    if (gasPrice) query.set('gasPrice', gasPrice);
                                    if (gasLimit) query.set('gasLimit', gasLimit.toString());
                                    const params = query.toString() ? `?${query.toString()}` : '';
                                    const link = `${protocol}${targetAddress}${chainIdPart}${functionPart}${params}`;

                                    expect(RequestLinkEncoding.createRequestLink(recipientAddress, options))
                                        .toEqual(link);

                                    // Note: parsing of links with custom chainId or contractAddress is currently not
                                    // supported.
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    it('should throw error due to bad arguments', () => {
        expect(() => RequestLinkEncoding.createRequestLink('', {
            currency: RequestLinkEncoding.Currency.ETH,
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Invalid recipient address: .');

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
