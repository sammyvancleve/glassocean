import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'], },
    { languageOptions: { globals: globals.node, }, },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            stylistic,
            tseslint,
        }
    },
    {
        rules: {
            '@/no-unused-vars': 'warn',
            'stylistic/semi': [
                'warn',
                'never'
            ],
            'stylistic/quotes': [
                'error',
                'single'
            ],
            'stylistic/max-len': [
                2,
                140,
                2,
                {
                    'ignoreUrls': true,
                    'ignoreStrings': true,
                    'ignoreTemplateLiterals': true,
                    'ignoreRegExpLiterals': true,
                    'ignoreComments': true,
                }
            ],
            'no-restricted-syntax': [
                'error',
                {
                    'selector': 'FunctionExpression',
                    'message': 'Function expressions are not allowed.',
                },
                {
                    'selector': 'FunctionDeclaration',
                    'message': 'Function declarations are not allowed.'
                }
            ],
            'stylistic/comma-dangle': [
                'warn',
                {
                    'arrays': 'never',
                    'functions': 'never',
                    'objects': 'always',
                    'imports': 'always',
                    'exports': 'always',
                }
            ],
            'prefer-arrow-callback': 'error',
            'stylistic/implicit-arrow-linebreak': ['error', 'beside'],
            'stylistic/indent': ['error', 2],
            'stylistic/jsx-quotes': ['error', 'prefer-single'],
            'stylistic/linebreak-style': 'off',
            'no-case-declarations': 'error',
            'no-lonely-if': 'error',
            'no-nested-ternary': 'error',
            'no-unused-expressions': 'error',
            'stylistic/object-curly-newline': ['error', {
                'ObjectPattern': { 'multiline': true, 'minProperties': 4, },
                'ObjectExpression': { 'multiline': true, 'minProperties': 4, },
            }],
            'stylistic/operator-linebreak': ['error', 'before'],
        }
    }
]