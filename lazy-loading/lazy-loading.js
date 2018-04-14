import Config from '/libraries/secure-utils/config/config.js';

export default class LazyLoading {
    static async loadScript(src) {
        let request = LazyLoading.REQUESTS.get(src);
        if (request) return request;
        request = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.addEventListener('load', resolve, { once: true });
            script.addEventListener('error', reject, { once: true });
            script.type = 'text/javascript';
            script.src = src;
            document.head.appendChild(script);
        });
        LazyLoading.REQUESTS.set(src, request);
        return request;
    }

    static async loadNimiq() {
        let request = LazyLoading.REQUESTS.get('nimiq');
        if (request) return request;
        if (typeof Nimiq === "undefined")
            request = LazyLoading.loadScript(Config.cdn).then(() => Nimiq.loadOffline());
        else if (!Nimiq._loaded) // only nimiq loader was loaded but not actual nimiq code
            request = Nimiq.load();
        else
            request = Promise.resolve();
        request = request.then(() => {
            let genesisConfigInitialized = true;
            try {
                Nimiq.GenesisConfig.NETWORK_ID;
            } catch(e) {
                genesisConfigInitialized = false;
            }
            if (!genesisConfigInitialized) {
                Nimiq.GenesisConfig[Config.network]();
            }
        });
        LazyLoading.REQUESTS.set('nimiq', request);
        return request;
    }
}
LazyLoading.REQUESTS = new Map();
