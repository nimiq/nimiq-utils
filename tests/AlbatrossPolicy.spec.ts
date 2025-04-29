/**
 * @jest-environment node
 *
 * This test validates our client-side calculations match the RPC implementation.
 */

import * as dotenv from 'dotenv';
import { BLOCKS_PER_EPOCH } from '../src/albatross-policy/constants';
import * as functions from '../src/albatross-policy/functions';

dotenv.config();

async function rpcCall(method: string, params: any[], options: { url: string }): Promise<any> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 });
    const fetchOptions = { method: 'POST', headers, body };
    const response = await fetch(options.url, fetchOptions);
    if (!response.ok) throw new Error(`HTTP error: ${JSON.stringify({ response, text: await response.text() })}.`);
    const responseBody = await response.json();
    if (responseBody.error) throw new Error(`RPC error: ${responseBody.error.message}`);
    return responseBody.result.data;
}

describe('Albatross Policy RPC Comparisons', () => {
    const url = process.env.NIMIQ_RPC_URL;
    if (!url) {
        console.warn(
            '**********************************************************\n'
            + '* ERROR: NIMIQ_RPC_URL environment variable is not set!  *\n'
            + '**********************************************************',
        );

        it('skips all tests due to missing NIMIQ_RPC_URL', () => {
            console.warn('All RPC comparison tests skipped due to missing NIMIQ_RPC_URL');
        });

        return;
    }

    it('verifies RPC connection by testing a small case', async () => {
        if (!url) return;
        const result = await rpcCall('getEpochAt', [3_000_000], { url });
        expect(typeof result).toBe('number');
    });

    const { getMigrationBlock } = functions;

    const testBlocks = [
        getMigrationBlock() - 1, // Pre-migration block
        getMigrationBlock(), // Migration block
        getMigrationBlock() + 1,
        getMigrationBlock() + BLOCKS_PER_EPOCH * 5 + 100,
        getMigrationBlock() + BLOCKS_PER_EPOCH * 10_000,
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
                if (fnName === 'lastMacroBlock' && block === 3455999) {
                    it.skip(`matches RPC ${rpcName} for block ${block} (skipped - RPC returns error for pre-Albatross blocks)`, async () => {
                        // Pre-Albatross blocks don't have macro blocks
                    });
                    return;
                }

                it(`matches RPC ${rpcName} for block ${block}`, async () => {
                    const rpcParams = [block];
                    const expected = await rpcCall(rpcName, rpcParams, { url });
                    const actual = fn(block);
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
                    const expected = await rpcCall(rpcName, rpcParams, { url });
                    const actual = fn(epoch);
                    expect(actual).toEqual(expected);
                });
            });
        });
    });
});
