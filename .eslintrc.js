module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'max-len': ['error', 120],
        'no-underscore-dangle': 'off',
        'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'import/prefer-default-export': 'off',
        'object-curly-newline': ['error', { 'ObjectPattern': { 'multiline': true } }],
        'prefer-const': ['error', {'destructuring': 'all'}],
        'no-nested-ternary': 'off',

        // Typescript plugin replacements
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'error',

        // False positives that are checked by TS
        'no-redeclare': 'off',
        'no-param-reassign': 'off',
        'import/no-unresolved': 'off',
        'no-use-before-define': 'off',
    },
};
