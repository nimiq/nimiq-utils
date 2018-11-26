// rollup.config.js
export default [
    {
        input: 'src/main.js',
        output: {
            file: 'dist/utils.common.js',
            format: 'cjs'
        }
    },
    {
        input: 'src/main.js',
        output: {
            file: 'dist/utils.umd.js',
            format: 'umd',
            name: 'window',
            extend: true
        }
    },
    {
        input: 'src/main.js',
        output: {
            file: 'dist/utils.es.js',
            format: 'es'
        }
    }
];
