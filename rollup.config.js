// rollup.config.js
const dependencies = Object.keys(require('./package.json').dependencies);

export default [
    {
        input: 'build/main.js',
        output: {
            file: 'dist/utils.common.js',
            format: 'cjs'
        },
        external: dependencies
    },
    {
        input: 'build/main.js',
        output: {
            file: 'dist/utils.umd.js',
            format: 'umd',
            name: 'window',
            extend: true
        },
        external: dependencies
    },
    {
        input: 'build/main.js',
        output: {
            file: 'dist/utils.es.js',
            format: 'es'
        },
        external: dependencies
    }
];
