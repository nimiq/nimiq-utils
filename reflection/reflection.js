export default class Reflection {
    /** @param {Object} proto
     *
     * @returns {Set<string>}
     */
    static userFunctions(proto) {
        return new Set(Reflection._deepFunctions(proto).filter(name => {
            return name !== 'constructor'
                && name !== 'fire'
                && name[0] !== '_';
        }));
    }

    /** @param {Object} proto
     *
     * @returns {string[]}
     */
    static _deepFunctions(proto) {
        if (!proto || proto === Object.prototype) return [];

        const ownProps = Object.getOwnPropertyNames(proto);

        const ownFunctions = ownProps.filter(name => {
            const desc = Object.getOwnPropertyDescriptor(proto, name);
            return !!desc && typeof desc.value === 'function';
        });

        const deepFunctions = Reflection._deepFunctions(Object.getPrototypeOf(proto));

        return [...ownFunctions, ...deepFunctions];
    }
}
