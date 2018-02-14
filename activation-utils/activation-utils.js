export default class ActivationUtils {
    static get API_ROOT() { return 'https://activate.nimiq-network.com' }

    /** @param {string} ethAddress
     *  @return {Promise<number>}*/
    static async fetchBalance(ethAddress) {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xcfb98637bcae43C13323EAa1731cED2B716962fD&tag=latest&address=${ethAddress}`)
        return (await response.json()).result;
    }

    /** @param {string} dashboardToken */
    static async getDashboardData(dashboardToken) {
        try {
            const request = fetch(
                `${ActivationUtils.API_ROOT}/list/${dashboardToken}`,
                { method: 'GET' }
            );
            return await request;
        } catch(e) {
            throw Error('Request failed');
        }
    }

    /** @param {string} activationToken
     *  @returns {boolean} */
    static async isValidToken(activationToken) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/activate/${activationToken}`,
            { method: 'GET' }
        );
        try {
            const response = await request;
            return response.ok;
        } catch (e) {
            return false;
        }
    }

    /** @param {string} activationToken
     * @param {string} nimiqAddress
     * @returns {boolean} */
    static async activateAddress(activationToken, nimiqAddress) {
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
        return response.ok;
    }

    /** @param {{birthday: Date, city: string, country_residence: string, country_nationality: string, email: string, sex: string, first_name: string, last_name: string, street: string, zip: string }} kycData */
    static async submitKyc(kycData) {
        const request = fetch(
            `${ActivationUtils.API_ROOT}/submit`,
            {
                method: 'POST',
                body: JSON.stringify(kycData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        return await request;
    }
}