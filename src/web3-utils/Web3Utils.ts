// this imports only the type without bundling the library
type BigInteger = import('big-integer').BigInteger

type Web3Provider = {
    sendAsync<R>(options: object, callback: (error: Error, result: RpcResult<R>) => void): void,
    send<R>(method: string, params: any[]): Promise<RpcResult<R>>,
    send<R>(request: {method: string, params: any[]}): Promise<RpcResult<R>>,
    networkVersion?: string,
    selectedAddress?: string | null,
    isMetaMask: boolean,
    autoRefreshOnNetworkChange: boolean,
    enable(): Promise<string|void>,
    on(event: string, handler: Function): void,
}

type EthRpcTransaction = {
    from?: string,
    to: string,
    value: string | number | bigint | BigInteger,
    gas?: string | number | bigint | BigInteger,
    gasPrice?: string | number | bigint | BigInteger,
    data?: string,
    chainId?: number,
}

type RpcResult<R> = {
    id?: number,
    jsonrpc?: string,
    result?: R,
    error?: {
        code: number,
        message: string,
    },
}

export class Web3Utils {
    static getProvider() {
        // @ts-ignore ethereum and web3 do not exists on window
        if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
            // @ts-ignore ethereum and web3 do not exists on window
            return (window.ethereum as Web3Provider) || (window.web3.currentProvider as Web3Provider)
        }

        throw new Error('No Web3 provider found')
    }

    static hasProvider(): boolean {
        try {
            this.getProvider()
            return true
        } catch (e) {
            return false
        }
    }

    static getProviderName(): string {
        const provider = this.getProvider()

        if (provider.isMetaMask) return 'MetaMask'
        return 'Browser Wallet'
    }

    static async getAddress() {
        const provider = this.getProvider()
        await provider.enable()

        if (provider.selectedAddress) return provider.selectedAddress

        // While MetaMask supports both `enable()` and `send('eth_requestAccounts')` to get active addresses,
        // Opera does not. The `eth_accounts` method works for both.
        const address = (await this._rpc<string[]>('eth_accounts'))[0]
        return address
    }

    static async getNetworkVersion() {
        const provider = this.getProvider()
        if (provider.networkVersion) return parseInt(provider.networkVersion)

        // While MetaMask supports the `networkVersion` prop,
        // Opera does not. The `net_version` method works for both.
        return parseInt(await this._rpc<string>('net_version'))
    }

    static async sendTransaction(
        params: EthRpcTransaction,
        network: number | string = 'main',
        changeNetworkCallback?: (network: string) => void,
    ) {
        const provider = this.getProvider()
        await provider.enable()

        let chainId = this.stringToChainId(params.chainId || network)

        while (await this.getNetworkVersion() !== chainId) {
            // Prevent website from reloading when user switches network
            provider.autoRefreshOnNetworkChange = false

            const networkName = this._capitalizeString(this.chainIdToString(chainId))

            if (typeof changeNetworkCallback === 'function') changeNetworkCallback(networkName)
            else alert(`To send this transaction, you must change the network in your Ethereum provider to "${networkName}"`)

            await new Promise<number>(resolve => {
                provider.on('networkChanged', resolve)
            })
        }

        if (!params.from) {
            params.from = await this.getAddress()
        }

        // Ethereum JSON-RPC requires numbers be given in HEX representation
        params.value = this._toHex(params.value)
        params.gas = typeof params.gas !== 'undefined' ? this._toHex(params.gas) : undefined
        params.gasPrice = typeof params.gasPrice !== 'undefined' ? this._toHex(params.gasPrice) : undefined
        params.chainId = chainId

        return this._rpc<string>('eth_sendTransaction', params)
    }

    static stringToChainId(network: number | string) {
        if (typeof network === 'number') return network

        switch (network.toLowerCase()) {
            case 'main':
            case 'mainnet':
                return 1
            case 'test':
            case 'testnet':
            case 'ropsten':
                return 3
            case 'rinkeby':
                return 4
            case 'goerli':
                return 5
            case 'kovan':
                return 42
            case 'geth':
                return 1337
            default:
                throw new Error('Invalid network name')
        }
    }

    static chainIdToString(id: number) {
        switch (id) {
            case 1: return 'mainnet'
            case 3: return 'ropsten'
            case 4: return 'rinkeby'
            case 5: return 'goerli'
            case 42: return 'kovan'
            case 1337: return 'geth'
            default: throw new Error('Invalid chain ID')
        }
    }

    private static async _rpc<R>(method: string, params?: any) {
        const provider = this.getProvider()

        if (typeof params !== 'undefined' && !Array.isArray(params)) params = [params]

        console.debug('WEB3 SEND:', method, params)

        const response = await new Promise<RpcResult<R>>(async (resolve, reject) => {
            if (typeof provider.send === 'function') {
                try {
                    // Use send() as specified in EIP-1193
                    provider.send<R>(method, params).then(resolve, reject)
                } catch (error) {
                    // Opera doesn't like EIP-1193 yet and implements a sync method with a single request object
                    try { resolve(provider.send<R>({ method, params })) } catch (error) { reject(error) }
                }
            } else if (typeof provider.sendAsync === 'function') {
                // Use deprecated sendAsync() with callback
                provider.sendAsync<R>({
                    method,
                    params,
                }, (error, result) => {
                    if (error) reject(error)
                    resolve(result)
                })
            }
            else reject(new Error('No known Web3 integration found'))
        })

        console.debug('WEB3 RECEIVE:', response)

        if (response.error) {
            throw new Error(response.error.message)
        }

        return response.result!
    }

    private static _toHex(value: string | number | bigint | BigInteger): string {
        if (typeof value === 'string') {
            if (value.substring(0, 2) !== '0x') throw new Error('Non-hex-encoded strings are not yet supported');
            return value;
        }
        return '0x' + value.toString(16);
    }

    private static _capitalizeString(str: string) {
        return str[0].toUpperCase() + str.slice(1)
    }
}
