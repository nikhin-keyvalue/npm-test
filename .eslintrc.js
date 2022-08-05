module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint', 'import', 'eslint-plugin-tsdoc', 'jsx-a11y'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
            jsx: true
        }
    },
    env: {
        browser: true,
        node: true,
        jest: true,
        es6: true
    },
    settings: {
        react: {
            pragma: 'h',
            version: '16.0'
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    rules: {
        'class-methods-use-this': 'off', // TODO
        'no-underscore-dangle': 'off', // TODO
        'import/prefer-default-export': 'off',
        'no-debugger': 'error',
        'no-trailing-spaces': 'error',
        'no-multi-spaces': 'error',
        indent: 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'max-len': [
            'error',
            {
                code: 150,
                tabWidth: 2,
                ignoreComments: true, // Allow long comments in the code
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true
            }
        ],
        "arrow-parens": ["error", "always"],
        'prefer-destructuring': 'off',
        'space-in-parens': ["error", "never"],
        'keyword-spacing': "error",
        // Do not care about dangling comma presence
        'comma-dangle': ['error', 'never'],
        // // Do not care about arrow function linebreak
        'implicit-arrow-linebreak': 'off',
        // // Do not care about empty lines about props
        'lines-between-class-members': 'off',
        // This is not important rule
        'object-curly-newline': 'off',
        // // Styling rule which doesn't add anything
        'no-multiple-empty-lines': ["error", { "max": 2, "maxEOF": 0 }],
        // This rule doesn't make sense in the latest browsers
        radix: 'off',
        // This serves no practical purpose
        'eol-last': ["error", "always"],
        'comma-spacing': [2, { "before": false, "after": true }],
        // the base rule can report incorrect errors
        'no-useless-constructor': 'error',
        'arrow-spacing': 'error',
        'space-infix-ops': 'error',
        'object-curly-spacing': ["error", "always"],
        'semi': ['error', 'always'],
        'space-before-blocks': "error",
        'padding-line-between-statements': [
            "error",
            { blankLine: "always", prev: "*", next: "return" },
            { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
            { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
        ],
        'curly': ["error", "multi", "consistent"],

        // Typescript Rules
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, vars: 'local' }],
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
        '@typescript-eslint/ban-types': 'off', // TODO
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off', // TODO

        // React Rules
        'react/prop-types': 'off',
        'react/display-name': 'off',

        // TSDoc
        'tsdoc/syntax': 'warn',

        // a11y
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/aria-role': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        'jsx-a11y/tabindex-no-positive': 'error',
        'jsx-a11y/no-redundant-roles': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/interactive-supports-focus': 'error',
        'jsx-a11y/autocomplete-valid': 'error',
        'jsx-a11y/no-static-element-interactions': 'error',
        'jsx-a11y/no-noninteractive-tabindex': 'error',
        'jsx-a11y/mouse-events-have-key-events': 'error'
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'off', overrides: { properties: 'explicit' } }]
            }
        },
        {
            files: ["*.test.tsx"],
            rules: {
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-call": "off"
            }
        }
    ]
};
