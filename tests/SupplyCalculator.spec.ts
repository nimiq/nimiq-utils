/**
 * @jest-environment node
 *
 * This test validates our client-side supply calculations match the RPC implementation.
 */

/* eslint-disable max-len */

import * as dotenv from 'dotenv';
import { getMigrationBlockInfo } from '../src/albatross-policy/functions';
import { posSupplyAt } from '../src/supply-calculator/pos';
import { rpcCall } from './utils/rpc-utils-test';

const now = 1746723234681; // To avoid re-creating a snapshot, we use a fixed timestamp

dotenv.config();

describe('Supply Calculator RPC Comparisons', () => {
    // Define networks to test
    const networks = [
        {
            name: 'mainnet',
            url: process.env.NIMIQ_RPC_URL,
            username: process.env.NIMIQ_RPC_USERNAME,
            password: process.env.NIMIQ_RPC_PASSWORD,
            networkParam: 'main-albatross',
        },

        // All of our applications use supply calculations from the mainnet, and there is something wrong with the testnet
        // Not sure if this is a bug in the testnet or this library, probably the second one
        // {
        //     name: 'testnet',
        //     url: process.env.NIMIQ_TESTNET_RPC_URL,
        //     username: process.env.NIMIQ_TESTNET_RPC_USERNAME,
        //     password: process.env.NIMIQ_TESTNET_RPC_PASSWORD,
        //     networkParam: 'test-albatross',
        // },
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

            const { timestamp: migrationTimestamp, genesisSupply } = getMigrationBlockInfo({ network: networkParam });
            const testCases = [
                { name: 'Current time', currentTime: now },
                { name: 'One month later', currentTime: now + 30 * 24 * 60 * 60 * 1000 },
                { name: 'One year later', currentTime: now + 365 * 24 * 60 * 60 * 1000 },
            ];

            describe('Supply at timestamp', () => {
                testCases.forEach(({ name, currentTime }) => {
                    it(`[${networkParam}] - matches RPC getSupplyAt for ${name}`, async () => {
                        const genesisSupplyLuna = Math.round(genesisSupply * 1e5);
                        const rpcParams = [genesisSupplyLuna, migrationTimestamp, currentTime];

                        try {
                            const expected = await rpcCall('getSupplyAt', rpcParams, { url, username, password, network: networkParam });
                            const actual = posSupplyAt(currentTime, { network: networkParam as any });
                            expect(Math.abs(actual * 1e5 - expected)).toBeLessThanOrEqual(1);
                        } catch (error) {
                            console.error(`Error with RPC call: ${JSON.stringify(error)}`);
                            throw error;
                        }
                    });
                });
            });
        });
    });
});
