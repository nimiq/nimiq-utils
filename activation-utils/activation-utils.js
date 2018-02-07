export default class ActivationUtils {
    static get API_ROOT() { return 'https://activate.nimiq-network.com' }

    /** @param {string} ethAddress
     *  @return {Promise<number>}*/
    static async fetchBalance(ethAddress) {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xcfb98637bcae43C13323EAa1731cED2B716962fD&tag=latest&address=${ethAddress}`)
        return (await response.json()).result;
    }

    /** @return {Promise<string>} */
    static async nim2ethAddress(address) {
        const addressObj = (typeof address  === 'string') ? ActivationUtils.getUnfriendlyAddress(address) : address;
        const hash = await Nimiq.Hash.sha256(addressObj.serialize());
        return '0x' + Nimiq.BufferUtils.toHex(hash.subarray(0, 20));
    }

    /** @param {string} friendlyAddress */
    static getUnfriendlyAddress(friendlyAddress) {
        return Nimiq.Address.fromUserFriendlyAddress(friendlyAddress);
    }

    /** @param {string} dashboardToken */
    async getDashboardData(dashboardToken) {
        try {
            const request = fetch(
                `${ActivationUtils.API_ROOT}/list/${dashboardToken}`,
                { method: 'GET' }
            );

            const result = await request.then(response => {
                if (!response.ok) {
                    this.onDashboardTokenError();
                } else {
                    return response.json();
                }
            });

            if (result) {
                this.onDashboardDataResult(result);
            } 
        } catch(e) {
            this.onDashboardTokenError();
        }
    }


    async isValidToken(activationToken) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/activate/${activationToken}`,
            { method: 'GET' }
        );
        try {
            const response = await request;
            this.onIsValidToken(response.ok);
        } catch (e) {
            this.onIsValidToken(false);
        }
    }

    async activateAddress(activationToken, ethAddress, nimiqAddress) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/activate/address`,
            { 
                method: 'POST',
                body: JSON.stringify({
                    'activation_token': activationToken,
                    'nimiq_address': nimiqAddress
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        );

        const response = await request;
        this.onActivateAddress(response.ok);
    }
}