/**
 * @jest-environment node
 *
 * This test validates our client-side calculations match the RPC implementation.
 */

/* eslint-disable max-len */

import * as dotenv from 'dotenv';
import { BLOCKS_PER_EPOCH } from '../src/albatross-policy/constants';
import * as functions from '../src/albatross-policy/functions';

dotenv.config();

interface RpcOptions {
    url?: string;
    username?: string;
    password?: string;
    network?: string;
}

async function rpcCall(method: string, params: any[], options: RpcOptions): Promise<any> {
    if (!options.url) {
        throw new Error('RPC URL is required');
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    // Add basic auth if credentials are provided
    if (options.username && options.password) {
        const auth = Buffer.from(`${options.username}:${options.password}`).toString('base64');
        headers.Authorization = `Basic ${auth}`;
    }

    const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 });
    const fetchOptions = { method: 'POST', headers, body };
    const response = await fetch(options.url, fetchOptions);
    if (!response.ok) throw new Error(`HTTP error: ${JSON.stringify({ response, text: await response.text() })}.`);
    const responseBody = await response.json();
    if (responseBody.error) throw new Error(`RPC error: ${responseBody.error.message}`);
    return responseBody.result.data;
}

describe('Albatross Policy RPC Comparisons', () => {
    // Define networks to test
    const networks = [
        {
            name: 'mainnet',
            url: process.env.NIMIQ_RPC_URL,
            username: process.env.NIMIQ_RPC_USERNAME,
            password: process.env.NIMIQ_RPC_PASSWORD,
            networkParam: 'main-albatross',
        },
        {
            name: 'testnet',
            url: process.env.NIMIQ_TESTNET_RPC_URL,
            username: process.env.NIMIQ_TESTNET_RPC_USERNAME,
            password: process.env.NIMIQ_TESTNET_RPC_PASSWORD,
            networkParam: 'test-albatross',
        },
    ];

    // Filter out networks with missing URLs
    const availableNetworks = networks.filter((network) => network.url);

    if (availableNetworks.length === 0) {
        console.warn(
            '**********************************************************\n'
            + '* ERROR: No RPC URL environment variables are set!       *\n'
            + '**********************************************************',
        );

        it('skips all tests due to missing RPC URLs', () => {
            console.warn('All RPC comparison tests skipped due to missing RPC URLs');
        });

        return;
    }

    // Run tests for each available network
    availableNetworks.forEach((network) => {
        describe(`Network: ${network.name}`, () => {
            const { url, username, password, networkParam } = network;

            it('verifies RPC connection by testing a small case', async () => {
                const result = await rpcCall('getEpochAt', [3_000_000], { url, username, password });
                expect(typeof result).toBe('number');
            });

            const { getMigrationBlock } = functions;

            // Get migration block for the current network
            const migrationBlock = getMigrationBlock({ network: networkParam });

            const testBlocks = [
                migrationBlock - 1, // Pre-migration block
                migrationBlock, // Migration block
                migrationBlock + 1,
                migrationBlock + BLOCKS_PER_EPOCH * 5 + 100,
                migrationBlock + BLOCKS_PER_EPOCH * 10_000,
            ];

            const epochs = [1, 10, 100, 1000];

            const rpcBlockMapping = [
                { fnName: 'epochAt', rpcName: 'getEpochAt' },
                { fnName: 'epochIndexAt', rpcName: 'getEpochIndexAt' },
                { fnName: 'batchAt', rpcName: 'getBatchAt' },
                { fnName: 'batchIndexAt', rpcName: 'getBatchIndexAt' },
                { fnName: 'isMacroBlockAt', rpcName: 'isMacroBlockAt' },
                { fnName: 'isElectionBlockAt', rpcName: 'isElectionBlockAt' },
                { fnName: 'isMicroBlockAt', rpcName: 'isMicroBlockAt' },
                { fnName: 'macroBlockAfter', rpcName: 'getMacroBlockAfter' },
                { fnName: 'lastMacroBlock', rpcName: 'getLastMacroBlock' },
                { fnName: 'electionBlockAfter', rpcName: 'getElectionBlockAfter' },
                { fnName: 'firstBatchOfEpoch', rpcName: 'getFirstBatchOfEpoch' },
                { fnName: 'blockAfterReportingWindow', rpcName: 'getBlockAfterReportingWindow' },
                { fnName: 'blockAfterJail', rpcName: 'getBlockAfterJail' },
            ] as { fnName: keyof typeof functions, rpcName: string }[];

            const rpcEpochMapping = [
                { fnName: 'firstBlockOf', rpcName: 'getFirstBlockOf' },
                { fnName: 'electionBlockOf', rpcName: 'getElectionBlockOf' },
            ] as { fnName: keyof typeof functions, rpcName: string }[];

            /**
             * Functions not tested via RPC:
             * - getMigrationBlock: Internal calculation function
             * - getMigrationBlockInfo: Returns derived data
             * - batchDelayPenalty
             * - lastBlockOfReportingWindow
             */

            // Test block-based functions
            rpcBlockMapping.forEach(({ fnName, rpcName }) => {
                const fn = functions[fnName];
                describe(fnName, () => {
                    testBlocks.forEach((block) => {
                        // Skip problematic test case
                        if (fnName === 'lastMacroBlock' && block === migrationBlock - 1) {
                            it.skip(`matches RPC ${rpcName} for block ${block} (skipped - RPC returns error for pre-Albatross blocks)`, async () => {
                                // Pre-Albatross blocks don't have macro blocks
                            });
                            return;
                        }

                        it(`matches RPC ${rpcName} for block ${block}`, async () => {
                            const rpcParams = [block];
                            const expected = await rpcCall(rpcName, rpcParams, { url, username, password });
                            const actual = fn(block, { network: networkParam });
                            expect(actual).toEqual(expected);
                        });
                    });
                });
            });

            // Test epoch-based functions
            rpcEpochMapping.forEach(({ fnName, rpcName }) => {
                const fn = functions[fnName];
                describe(fnName, () => {
                    epochs.forEach((epoch) => {
                        it(`matches RPC ${rpcName} for epoch ${epoch}`, async () => {
                            const rpcParams = [epoch];
                            const expected = await rpcCall(rpcName, rpcParams, { url, username, password });
                            const actual = fn(epoch, { network: networkParam });
                            expect(actual).toEqual(expected);
                        });
                    });
                });
            });
        });
    });
});
