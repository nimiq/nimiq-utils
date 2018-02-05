export default class ActivationUtils {
    static get API_ROOT() { return 'https://activate.nimiq-network.com' }

    async fetchBalance(address) {
        const wallet = await Nimiq.Wallet.generate();
        console.log('Nimiq address: ' + wallet.address.toUserFriendlyAddress());
        const ethAddress = await RedeemTools.nim2ethAddress(wallet.address);
        console.log('Ethereum address: ' + ethAddress);

        const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xcfb98637bcae43C13323EAa1731cED2B716962fD&tag=latest&address=${ethAddress}`)
        return response.json();
    }

    async nim2ethAddress(address) {
        const hash = await Nimiq.Hash.sha256(address.serialize());
        return '0x' + Nimiq.BufferUtils.toHex(hash.subarray(0, 20));
    }

    async getDashboardData(dashboardToken) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/list/${dashboardToken}`, {
                method: 'GET',
                headers: new Headers()
            }
        );

        const response = await request.then(response => response.json());
        this.onDashboardDataResult(response);
    }

    async isValidToken(activationToken) {
        const request = fetch(`${ActivationUtils.API_ROOT}/activate`, { method: 'GET' });
        try {
            await request;
            this.onIsValidToken(true);
        } catch (e) {
            this.onIsValidToken(false);
        }
    }

    async activateAddress(activationToken, address) {
        
    }
}