export enum SwapAsset {
    NIM = 'NIM',
    BTC = 'BTC',
    EUR = 'EUR',
}

// Internal Types

type FastspotAsset = {
    symbol: SwapAsset,
    name: string,
    feePerUnit: string,
    limits?: {
        minimum: string | null,
        maximum: string | null,
    },
    software?: {
        name: string,
        version: string | null,
        network: 'test' | 'main',
        syncBlockHeight: number,
    },
    provider?: {
        url: string,
        company: string | null,
        engine: 'mock',
    },
};

type FastspotFee = {
    perUnit: string,
    total: string,
    totalIsIncluded: boolean,
};

type FastspotPrice = {
    symbol: 'NIM' | 'BTC',
    name: string,
    amount: string,
    fundingNetworkFee: FastspotFee,
    operatingNetworkFee: FastspotFee,
    finalizeNetworkFee: FastspotFee,
};

type FastspotEstimate = {
    from: FastspotPrice[],
    to: FastspotPrice[],
    serviceFeePercentage: string | number,
    direction: 'forward' | 'reverse',
};

type FastspotContract<T extends SwapAsset> = {
    asset: T,
    refund: { address: string },
    recipient: { address: string },
    amount: number,
    timeout: number,
    direction: 'send' | 'receive',
    status: string,
    id: string,
    intermediary: T extends SwapAsset.NIM ? {
        address: string,
        timeoutBlock: number,
        data: string,
    } : T extends SwapAsset.BTC ? {
        p2sh: string,
        p2wsh: string,
        scriptBytes: string,
    } : never,
};

type FastspotContractWithEstimate<T extends SwapAsset> = {
    contract: FastspotContract<T>,
    info: FastspotEstimate,
};

type FastspotPreSwap = {
    id: string,
    status: string,
    expires: number,
    info: FastspotEstimate,
};

type FastspotSwap = FastspotPreSwap & {
    hash: string,
    contracts: FastspotContract<SwapAsset>[],
};

type FastspotLimits<T extends SwapAsset> = {
    asset: T,
    current: string,
    daily: string,
    monthly: string,
};

type FastspotResult
    = FastspotAsset[]
    | FastspotEstimate[]
    | FastspotSwap
    | FastspotContractWithEstimate<SwapAsset>
    | FastspotLimits<SwapAsset>;

type FastspotError = {
    status: number,
    type: string,
    title: string,
    detail: string,
};

// Public Types

export type Asset = {
    asset: SwapAsset,
    name: string,
    feePerUnit: number,
    limits: {
        minimum: number,
        maximum: number,
    },
};

export type AssetList = {[asset in SwapAsset]: Asset};

// export type RequestAsset = Partial<Record<SwapAsset, number>>;
export type RequestAsset<K extends SwapAsset> = {
    [P in K]: (Record<P, number> &
        Partial<Record<Exclude<K, P>, never>>) extends infer O
            ? { [Q in keyof O]: O[Q] }
            : never
}[K];

export type PriceData = {
    asset: SwapAsset,
    amount: number,
    fee: number,
    feePerUnit: number,
    serviceNetworkFee: number,
};

export type Estimate = {
    from: PriceData,
    to: PriceData,
    serviceFeePercentage: number,
};

export type NimHtlcDetails = {
    address: string,
    timeoutBlock: number,
    data: string,
};

export type BtcHtlcDetails = {
    address: string,
    script: string,
};

export type Contract<T extends SwapAsset> = {
    asset: T,
    refundAddress: string,
    redeemAddress: string,
    amount: number,
    timeout: number,
    direction: 'send' | 'receive',
    status: string,
    htlc: T extends SwapAsset.NIM ? NimHtlcDetails
        : T extends SwapAsset.BTC ? BtcHtlcDetails
        : never,
};

export type ContractWithEstimate<T extends SwapAsset> = Estimate & {
    contract: Contract<T>,
};

export type PreSwap = Estimate & {
    id: string,
    expires: number,
    status: string,
};

export type Swap = PreSwap & {
    hash: string,
    contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>>,
};

export type Limits<T extends SwapAsset> = {
    asset: T,
    current: number,
    daily: number,
    monthly: number,
};

/**
 * Variables
 */

let API_URL: string | undefined;
let API_KEY: string | undefined;

/**
 * Methods
 */

export function init(url: string, key: string) {
    if (!url || !key) throw new Error('url and key must be provided');
    API_URL = url;
    API_KEY = key;
}

function coinsToUnits(asset: SwapAsset, value: string | number): number {
    let decimals: number;
    switch (asset) {
        case SwapAsset.NIM: decimals = 5; break;
        case SwapAsset.BTC: decimals = 8; break;
        case SwapAsset.EUR: decimals = 2; break;
        default: throw new Error('Invalid asset');
    }
    const parts = value.toString().split('.');
    parts[1] = (parts[1] || '').substr(0, decimals).padEnd(decimals, '0');
    return parseInt(parts.join(''), 10);
}

function convertFromData(from: FastspotPrice): PriceData {
    const asset = SwapAsset[from.symbol];
    return {
        asset,
        amount: coinsToUnits(asset, from.amount),
        fee: coinsToUnits(asset, from.fundingNetworkFee.total),
        feePerUnit: coinsToUnits(asset, from.fundingNetworkFee.perUnit),
        serviceNetworkFee: coinsToUnits(asset, from.finalizeNetworkFee.total),
    };
}

function convertToData(to: FastspotPrice): PriceData {
    const asset = SwapAsset[to.symbol];
    return {
        asset,
        amount: coinsToUnits(asset, to.amount),
        fee: coinsToUnits(asset, to.finalizeNetworkFee.total),
        feePerUnit: coinsToUnits(asset, to.finalizeNetworkFee.perUnit),
        serviceNetworkFee: coinsToUnits(asset, to.fundingNetworkFee.total),
    };
}

function convertContract<T extends SwapAsset>(contract: FastspotContract<T>): Contract<T> {
    return {
        asset: contract.asset,
        refundAddress: contract.refund.address,
        redeemAddress: contract.recipient.address,
        amount: coinsToUnits(contract.asset, contract.amount),
        timeout: contract.timeout,
        direction: contract.direction,
        status: contract.status,

        ...(contract.asset === SwapAsset.NIM ? {
            htlc: (contract as FastspotContract<SwapAsset.NIM>).intermediary,
        } : {}),

        ...(contract.asset === SwapAsset.BTC ? {
            htlc: {
                address: (contract as FastspotContract<SwapAsset.BTC>).intermediary.p2wsh,
                script: (contract as FastspotContract<SwapAsset.BTC>).intermediary.scriptBytes,
            },
        } : {}),
    } as Contract<T>;
}

function convertSwap(swap: FastspotSwap): Swap;
function convertSwap(swap: FastspotPreSwap): PreSwap;
function convertSwap(swap: FastspotPreSwap | FastspotSwap): PreSwap | Swap {
    const inputObject = swap.info.from[0];
    const outputObject = swap.info.to[0];

    const preSwap: PreSwap = {
        id: swap.id,
        expires: Math.floor(swap.expires), // `result.expires` can be a float timestamp
        from: convertFromData(inputObject),
        to: convertToData(outputObject),
        status: swap.status,
        serviceFeePercentage: parseFloat(swap.info.serviceFeePercentage as string),
    };

    if ('contracts' in swap) {
        const contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>> = {};
        for (const contract of swap.contracts) {
            contracts[contract.asset] = convertContract(contract);
        }

        const fullSwap: Swap = {
            ...preSwap,
            hash: swap.hash,
            contracts,
        };

        return fullSwap;
    }

    return preSwap;
}

function convertLimits<T extends SwapAsset>(limits: FastspotLimits<T>): Limits<T> {
    return {
        asset: limits.asset,
        current: coinsToUnits(limits.asset, limits.current),
        daily: coinsToUnits(limits.asset, limits.daily),
        monthly: coinsToUnits(limits.asset, limits.monthly),
    };
}

function validateRequestPairs(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): boolean {
    let fromAsset: SwapAsset;
    let toAsset: SwapAsset;

    if (typeof from === 'string') {
        if (!Object.values(SwapAsset).includes(from)) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = from;
    } else {
        if (Object.keys(from).length !== 1) {
            throw new Error('Only one asset allowed for FROM');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(from)[0] as SwapAsset)) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = Object.keys(from)[0] as SwapAsset;
    }

    if (typeof to === 'string') {
        if (!Object.values(SwapAsset).includes(to)) {
            throw new Error('Invalid TO asset');
        }
        toAsset = to;
    } else {
        if (Object.keys(to).length !== 1) {
            throw new Error('Only one asset allowed for TO');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(to)[0] as SwapAsset)) {
            throw new Error('Invalid TO asset');
        }
        toAsset = Object.keys(to)[0] as SwapAsset;
    }

    if (fromAsset === toAsset) {
        throw new Error('FROM and TO assets must be different');
    }

    return true;
}

async function api(path: string, method: 'POST' | 'GET' | 'DELETE', body?: object): Promise<FastspotResult> {
    if (!API_URL || !API_KEY) throw new Error('API URL and key not set, call init() first');

    return fetch(`${API_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-FAST-ApiKey': API_KEY,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    }).then(async (res) => {
        if (!res.ok) {
            const error = await res.json() as FastspotError;
            throw new Error(error.detail);
        }
        return res.json();
    });
}

export async function getEstimate(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<Estimate>;
export async function getEstimate(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<Estimate>;
export async function getEstimate(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): Promise<Estimate> {
    validateRequestPairs(from, to);

    const result = await api('/estimates', 'POST', {
        from,
        to,
        includedFees: 'required',
    }) as FastspotEstimate[];

    const inputObject = result[0].from[0];
    const outputObject = result[0].to[0];
    if (!inputObject || !outputObject) throw new Error('Insufficient market liquidity');

    const estimate: Estimate = {
        from: convertFromData(inputObject),
        to: convertToData(outputObject),
        serviceFeePercentage: parseFloat(result[0].serviceFeePercentage as string),
    };

    return estimate;
}

export async function createSwap(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<PreSwap>;
export async function createSwap(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<PreSwap>;
export async function createSwap(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): Promise<PreSwap> {
    validateRequestPairs(from, to);

    const result = await api('/swaps', 'POST', {
        from,
        to,
        includedFees: 'required',
    }) as FastspotPreSwap;

    return convertSwap(result);
}

export async function confirmSwap(
    swap: PreSwap,
    redeem: { asset: SwapAsset, address: string },
    refund: { asset: SwapAsset, address: string },
): Promise<Swap> {
    const result = await api(`/swaps/${swap.id}`, 'POST', {
        confirm: true,
        beneficiary: { [redeem.asset]: redeem.address },
        refund: { [refund.asset]: refund.address },
    }) as FastspotSwap;

    return convertSwap(result);
}

export async function getSwap(id: string): Promise<PreSwap | Swap> {
    const result = await api(`/swaps/${id}`, 'GET') as FastspotPreSwap | FastspotSwap;
    return convertSwap(result);
}

export async function cancelSwap(swap: PreSwap): Promise<PreSwap> {
    const result = await api(`/swaps/${swap.id}`, 'DELETE') as FastspotPreSwap;
    return convertSwap(result);
}

export async function getContract<T extends SwapAsset>(asset: T, address: string): Promise<ContractWithEstimate<T>> {
    const result = await api(`/contracts/${asset}/${address}`, 'GET') as FastspotContractWithEstimate<T>;
    return {
        contract: convertContract(result.contract),
        from: convertFromData(result.info.from[0]),
        to: convertToData(result.info.to[0]),
        serviceFeePercentage: parseFloat(result.info.serviceFeePercentage as string),
    };
}

export async function getLimits<T extends SwapAsset>(asset: T, address: string): Promise<Limits<T>> {
    const result = await api(`/limits/${asset}/${address}`, 'GET') as FastspotLimits<T>;
    return convertLimits(result);
}

export async function getAssets(): Promise<AssetList> {
    const result = await api('/assets', 'GET') as FastspotAsset[];
    const records: Partial<AssetList> = {};
    for (const record of result) {
        try {
            records[record.symbol] = {
                asset: record.symbol,
                name: record.name,
                feePerUnit: coinsToUnits(record.symbol, record.feePerUnit),
                limits: {
                    minimum: record.limits && record.limits.minimum
                        ? coinsToUnits(record.symbol, record.limits.minimum)
                        : 0,
                    maximum: record.limits && record.limits.maximum
                        ? coinsToUnits(record.symbol, record.limits.maximum)
                        : Infinity,
                },
            };
        } catch (error) {
            console.warn(error.message, record); // eslint-disable-line no-console
        }
    }
    return records as AssetList;
}
