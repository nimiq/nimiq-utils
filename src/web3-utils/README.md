# Web3Utils

Provides helper functions to work with in-browser Web3 Ethereum providers.

- [hasProvider](#hasprovider)
- [getProvider](#getprovider)
- [getProviderName](#getprovidername)
- [getAddress](#getaddress)
- [getNetworkVersion](#getnetworkversion)
- [sendTransaction](#sendtransactionparams-network-changenetworkcallback)
- [stringToChainId](#stringtochainidnetwork)
- [chainIdToString](#chainidtostringid)

## hasProvider()

```ts
const hasProvider = Web3Utils.hasProvider(): boolean
```

Determines if a Web3 provider is available in the browser.

## getProvider()

```ts
const provider = Web3Utils.getProvider(): Web3Provider
```

Returns a reference to the active in-browser Web3 provider.

## getProviderName()

```ts
const providerName = Web3Utils.getProviderName(): string
```

Returns a userfriendly name for the provider. Currently only MetaMask can be detected,
other providers are simply called 'Browser Wallet'.

## getAddress()

```ts
const address = await Web3Utils.getAddress(): Promise<string>
```

Returns the user's provided address for this website.

## getNetworkVersion()

```ts
const chainId = await Web3Utils.getNetworkVersion(): Promise<number>
```

Returns the Ethereum chain ID that the provider is currently configured for.

## sendTransaction(params, network?, changeNetworkCallback?)

```ts
const hash = await Web3Utils.sendTransaction(
    params: EthRpcTransaction, // Explained below
    network: number | string = 'main',
    changeNetworkCallback?: (network: string) => void,
): Promise<string>
```

Requests the user to send a transaction defined by `params` to the network optionally
defined by `network`. If the user has to change the network in their provider, the
optional `changeNetworkCallback` method is called with the name of the network the
user has to switch to (when not provided, a simple `alert()` is shown to the user).

The `params` look like this:

```ts
type EthRpcTransaction = {
    from?: string,
    to: string, // HEX-encoded ETH address: '0x...'
    value: string | number | bigint | BigInteger,
    gas?: string | number | bigint | BigInteger,
    gasPrice?: string | number | bigint | BigInteger,
    data?: string, // HEX-encoded
    chainId?: number,
}
```

If `value`, `gas` or `gasPrice` is given as a string, it **must** be a HEX-encoded
number with a `'0x'` prefix.

## stringToChainId(network)

```ts
const chainId = Web3Utils.stringToChainId(network: number | string): number
```

Converts a case-insensitive network name to the respective Ethereum chain ID.
Valid network names are 'main', 'mainnet', 'test', 'testnet', 'ropsten', 'rinkeby',
'goerli', 'kovan', 'geth'.

## chainIdToString(id)

```ts
const networkName = Web3Utils.chainIdToString(id: number): string
```

Converts an Ethereum chain ID to a lowercase network name. Valid chain IDs are 1, 3, 4, 5, 42, 1337.
