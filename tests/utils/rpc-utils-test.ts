/**
 * Shared utilities for RPC testing with Jest snapshot support
 */

export interface RpcOptions {
    url?: string;
    username?: string;
    password?: string;
    network?: string;
}

/**
 * Make an RPC call with Jest snapshot support
 * @param method - RPC method name
 * @param params - RPC parameters
 * @param options - RPC options
 * @returns RPC result promise
 */
export async function rpcCall<T = any>(
    method: string,
    params: any[],
    options: RpcOptions,
): Promise<T> {
    if (!options.url) {
        throw new Error('RPC URL is required');
    }

    // Check for update mode
    const isUpdateMode = process.argv.includes('--updateSnapshot') || process.argv.includes('-u');

    // Create a unique snapshot name for this test case
    // Jest automatically gets the current test name and manages snapshots
    const snapshotName = `${method}(${JSON.stringify(params)})`;

    // If not in update mode, try to match with the snapshot
    if (!isUpdateMode) {
        try {
            // Try to match against snapshot
            expect({ method, params, result: null }).toMatchSnapshot(snapshotName);

            // If snapshot exists, Jest will replace 'null' with the actual value from the snapshot
            // We can get it by calling toMatchSnapshot again and catching the error
            try {
                expect({ method, params, result: 'placeholder' }).toMatchSnapshot(snapshotName);
            } catch (error) {
                // The error message contains the expected snapshot value
                const errorMessage = (error as Error).message;
                const match = errorMessage.match(/"result": (.*?)(?=,|\s*})/s);
                if (match && match[1] !== 'null') {
                    // Parse the result from the snapshot
                    try {
                        // Remove trailing comma if present
                        const cleanJson = match[1].replace(/,\s*$/, '');
                        return JSON.parse(cleanJson) as T;
                    } catch (e) {
                        console.warn('Could not parse snapshot result:', e);
                    }
                }
            }
        } catch (error) {
            // Snapshot doesn't exist or couldn't be parsed, proceed with actual RPC call
        }
    }

    // Make the actual RPC call
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    // Add basic auth if credentials are provided
    if (options.username && options.password) {
        const auth = Buffer.from(`${options.username}:${options.password}`).toString('base64');
        headers.Authorization = `Basic ${auth}`;
    }

    const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 });
    const fetchOptions = { method: 'POST', headers, body };

    const response = await fetch(options.url, fetchOptions);
    if (!response.ok) {
        throw new Error(`HTTP error: ${JSON.stringify({ response, text: await response.text() })}.`);
    }

    const responseBody = await response.json();
    if (responseBody.error) throw new Error(`RPC error: ${responseBody.error.message}`);

    const result = responseBody.result.data as T;

    // Update the snapshot with the actual result
    expect({ method, params, result }).toMatchSnapshot(snapshotName);

    return result;
}
