/* eslint-disable spaced-comment */
/// <reference lib="es2017" />
/// <reference lib="esnext.bigint" />
/* eslint-enable spaced-comment */

/* global describe, it, expect, BigInt */

import * as RequestLinkEncoding from '../src/request-link-encoding/RequestLinkEncoding';
import { toNonScientificNumberString } from '../src/formattable-number/FormattableNumber';

const { Currency } = RequestLinkEncoding;

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
                { currencies: [Currency.NIM] },
            );
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.message).toEqual(vector.message);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: Currency.NIM,
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
                { currencies: [Currency.NIM] },
            );
            expect(parsed!.recipient).toEqual(vector.address);
            expect(parsed!.amount).toEqual(vector.amount);
            expect(parsed!.message).toEqual(vector.message);
        }

        // Create links
        for (const vector of vectors) {
            const options: RequestLinkEncoding.GeneralRequestLinkOptions = {
                currency: Currency.NIM,
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
                { currencies: [Currency.BTC] },
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
                currency: Currency.BTC,
                ...vector,
            };

            const link = RequestLinkEncoding.createRequestLink(vector.address, options);
            expect(link).toEqual(vector.link);
        }
    });

    it('can parse and create ETH and ETH contract request links', () => {
        const {
            ETHEREUM_SUPPORTED_NATIVE_CURRENCIES,
            ETHEREUM_SUPPORTED_CONTRACTS,
            ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP,
            EthereumChain,
        } = RequestLinkEncoding;
        const knownEthereumChainIds = Object.values(EthereumChain)
            .filter((value) => typeof value === 'number') as number[]; // filter out enum reverse mappings
        const knownEthereumContracts = Object.keys(ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP);

        const recipientAddress = '0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359';
        const customChainId = 123;
        const customContractAddress = '0x0123456789012345678901234567890123456789';

        // Note: the test samples will include tests for known contract addresses on the "wrong" chain and chain ids for
        // a mismatching currency, but that's fine as contracts and chain ids are prioritized over the passed currency
        // in createEthereumRequestLink and parseEthereumRequestLink.
        for (const currency of [...ETHEREUM_SUPPORTED_NATIVE_CURRENCIES, Currency.USDC] as const) {
            for (const chainId of [undefined, ...knownEthereumChainIds, customChainId]) {
                for (const contractAddress of [undefined, ...knownEthereumContracts, customContractAddress]) {
                    for (const amount of [undefined, `2.014e${currency !== Currency.USDC ? 18 : 6}`]) {
                        for (const gasPrice of [undefined, '9e9']) {
                            for (const gasLimit of [undefined, 100000]) {
                                // Alternative, much simplified and less versatile implementation of
                                // RequestLinkEncoding.createEthereumLink
                                const effectiveContractAddress = contractAddress
                                    // @ts-ignore only Currency.USDC is a defined index
                                    || (ETHEREUM_SUPPORTED_CONTRACTS[chainId] || {})[currency];
                                const [
                                    contractChainId,
                                    contractCurrency,
                                ] = ETHEREUM_SUPPORTED_CONTRACTS_REVERSE_LOOKUP[effectiveContractAddress || '']
                                    || [] as undefined[];
                                const chainName = EthereumChain[chainId || -1]
                                    || EthereumChain[contractChainId || -1] || '';
                                const protocol = /^ethereum/i.test(chainName) ? 'ethereum:'
                                    : /^polygon/i.test(chainName) ? 'polygon:'
                                        : currency === Currency.MATIC ? 'polygon:'
                                            : 'ethereum:';
                                const targetAddress = effectiveContractAddress || recipientAddress;
                                const chainIdPart = chainId && (chainId !== EthereumChain.ETHEREUM_MAINNET
                                    || (contractChainId && chainId !== contractChainId))
                                    ? `@${chainId}`
                                    : '';
                                const functionPart = effectiveContractAddress ? '/transfer' : '';
                                const query = new URLSearchParams();
                                if (effectiveContractAddress) query.set('address', recipientAddress);
                                if (amount) query.set(effectiveContractAddress ? 'uint256' : 'value', amount);
                                if (gasPrice) query.set('gasPrice', gasPrice);
                                if (gasLimit) query.set('gasLimit', gasLimit.toString());
                                const params = query.toString() ? `?${query.toString()}` : '';
                                const link = `${protocol}${targetAddress}${chainIdPart}${functionPart}${params}`;

                                try {
                                    expect(RequestLinkEncoding.createRequestLink(recipientAddress, {
                                        currency,
                                        amount: amount ? BigInt(toNonScientificNumberString(amount)) : undefined,
                                        gasPrice: gasPrice ? BigInt(toNonScientificNumberString(gasPrice)) : undefined,
                                        gasLimit,
                                        chainId,
                                        contractAddress,
                                    })).toBe(link);
                                } catch (e) {
                                    // Rethrow unexpected errors.
                                    // Expected errors for disallowed inputs are tested in the next test
                                    // it('should throw error for Ethereum link creation due to bad arguments'):
                                    // - mismatching chainId and contractChainId
                                    // - missing chain id and contract address for contract currencies (USDC)
                                    // - missing contract address for custom chain id for contract currencies (USDC)
                                    if (!(
                                        (chainId && contractChainId && chainId !== contractChainId)
                                        || (currency === Currency.USDC && !chainId && !contractAddress)
                                        || (currency === Currency.USDC && chainId === customChainId && !contractAddress)
                                    )) throw e;
                                }

                                const parseResult = RequestLinkEncoding.parseRequestLink(
                                    link,
                                    { currencies: [...ETHEREUM_SUPPORTED_NATIVE_CURRENCIES, Currency.USDC] },
                                );

                                // Link should only not be parseable when the chainId contradicts the expected chain id
                                // for a known contract, or the link contains a custom chain id or contractAddress, for
                                // which parsing is currently not supported.
                                expect(!!parseResult).toBe((!chainId || !contractChainId || chainId === contractChainId)
                                    && chainId !== customChainId && contractAddress !== customContractAddress);
                                if (!parseResult) continue; // eslint-disable-line no-continue

                                // The currency returned by parseEthereumRequestLink only matches the currency passed to
                                // createEthereumRequestLink if it hasn't been overruled by the chain id or contract
                                // chain id.
                                const chainCurrency = /^polygon/i.test(chainName || link)
                                    ? Currency.MATIC
                                    : Currency.ETH;
                                const expectedCurrency = contractCurrency || chainCurrency;
                                if ((!chainId && !contractAddress && currency !== Currency.USDC) || (contractAddress
                                    // @ts-ignore only Currency.USDC is a defined index
                                    ? contractAddress === ETHEREUM_SUPPORTED_CONTRACTS[contractChainId][currency]
                                    : chainId && currency === chainCurrency
                                )) {
                                    // Cross-check our test implementation for when the parsed currency should match the
                                    // input currency, which should be the case when:
                                    // - no contract address and no chain id are set, because in that case they can not
                                    //   overrule the input currency. If it's a contract currency (USDC), this is an
                                    //   invalid currency though if no contract address and chain id are provided, see
                                    //   link creation error handling above.
                                    // - the contract address is set and matches what's defined for the input currency
                                    //   and chainId in ETHEREUM_SUPPORTED_CONTRACTS. Note that if the contract address
                                    //   is set, it has to be one of our known contracts at this point, because the
                                    //   parsing returns null for unknown contracts. Also note, that the contract chain
                                    //   id has to match the input chain id if it's set, as otherwise the parsing would
                                    //   also have returned null.
                                    // - chainId set and is a known chainId for the given currency and the contract
                                    //   address is not set (because it has priority over the chainId). Note that if it
                                    //   is set, it has to be one of our known chain ids at this point, because the
                                    //   parsing returns null for unknown chain ids.
                                    expect(currency).toBe(expectedCurrency);
                                }

                                expect(parseResult.currency).toBe(expectedCurrency);
                                expect(parseResult.recipient).toBe(recipientAddress);
                                expect(parseResult.amount ? parseResult.amount.toString() : undefined)
                                    .toBe(amount ? toNonScientificNumberString(amount) : undefined);
                                expect(parseResult.gasPrice ? parseResult.gasPrice.toString() : undefined)
                                    .toBe(gasPrice ? toNonScientificNumberString(gasPrice) : undefined);
                                expect(parseResult.gasLimit).toBe(gasLimit);
                                // Chain id is not encoded in native ETH request links, and thus not retrieved when
                                // parsing, if it's the ETH main chain.
                                expect(parseResult.chainId || EthereumChain.ETHEREUM_MAINNET)
                                    // The parsed chain id is based on the contractChainId or the protocol (which itself
                                    // is based on the chain id, contract chain id or currency), if no chain id is
                                    // encoded in the request link.
                                    .toBe(chainId || contractChainId || (currency === Currency.MATIC
                                        ? EthereumChain.POLYGON_MAINNET : EthereumChain.ETHEREUM_MAINNET));
                                expect(parseResult.contractAddress).toBe(effectiveContractAddress);
                            }
                        }
                    }
                }
            }
        }
    });

    it('should throw error for Ethereum link creation with bad arguments', () => {
        expect(() => RequestLinkEncoding.createRequestLink('', {
            currency: Currency.ETH,
        })).toThrowError('Invalid recipient address: .');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: 'UnkonwnCurrency' as unknown as RequestLinkEncoding.Currency,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        } as RequestLinkEncoding.GeneralRequestLinkOptions)).toThrowError('Unsupported currency');

        expect(() => RequestLinkEncoding.createRequestLink('0x123', {
            currency: Currency.ETH,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
        })).toThrowError('Invalid recipient address');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: Currency.ETH,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: '0x123',
        })).toThrowError('Invalid contract address');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: Currency.USDC,
        })).toThrowError('No contractAddress or chainId provided for usdc transaction');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: Currency.USDC,
            chainId: 123,
        })).toThrowError('Unsupported chainId: 123. You need to specify the \'contractAddress\' option.');

        expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
            currency: Currency.USDC,
            chainId: RequestLinkEncoding.EthereumChain.ETHEREUM_MAINNET,
            contractAddress: RequestLinkEncoding.ETHEREUM_SUPPORTED_CONTRACTS
                // eslint-disable-next-line no-unexpected-multiline
                [RequestLinkEncoding.EthereumChain.ETHEREUM_GOERLI_TESTNET][Currency.USDC],
        })).toThrowError('chainId does not match chain id associated to contractAddress');

        for (const option of ['amount', 'gasPrice', 'gasLimit', 'chainId']) {
            for (const value of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
                expect(() => RequestLinkEncoding.createRequestLink('0xfb6916095ca1df60bb79Ce92ce3ea74c37c5d359', {
                    currency: Currency.ETH,
                    [option]: value,
                })).toThrowError(`Invalid ${option}`);
            }
        }
    });

    it('can normalize addresses in request links', () => {
        const vectors = [{
            link: 'nimiq:nq24-458e-67e1%20c90m+c0xq+146b%20ce6r jmyr e27s',
            recipient: 'NQ24 458E 67E1 C90M C0XQ 146B CE6R JMYR E27S',
        }, {
            link: 'bitcoin:BC1P596KRFCPAEAFY5Z76VR3HJQDX8H5VY5QHKMLXNKT4GG5D0788DPQATVLSQ',
            recipient: 'bc1p596krfcpaeafy5z76vr3hjqdx8h5vy5qhkmlxnkt4gg5d0788dpqatvlsq',
        }, {
            link: 'ethereum:0xABCDEFABCDabcdefabcd012345678901234567890123456789/transfer?'
                + 'address=0x01234567890123456789ABCDEFABCDabcdefabcd',
            contractAddress: '0xabcdefabcdabcdefabcd012345678901234567890123456789',
            recipient: '0x01234567890123456789abcdefabcdabcdefabcd',
        }];

        // Parse links
        for (const vector of vectors) {
            const parsed = RequestLinkEncoding.parseRequestLink(
                vector.link,
                {
                    // Dummy normalization for testing.
                    normalizeAddress: {
                        [Currency.BTC]: (address) => address.toLowerCase(),
                        [Currency.ETH]: (address) => address.toLowerCase(),
                    },
                },
            );
            expect(parsed).toBeDefined();
            if (!parsed) continue; // eslint-disable-line no-continue
            expect(parsed.recipient).toBe(vector.recipient);
            if ('contractAddress' in parsed) {
                expect(parsed.contractAddress).toBe(vector.contractAddress);
            } else {
                expect(vector.contractAddress).toBeUndefined();
            }
        }
    });
});
