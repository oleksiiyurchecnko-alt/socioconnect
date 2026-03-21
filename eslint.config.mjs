import nx from '@nx/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import sheriffEslint from '@softarc/eslint-plugin-sheriff';

const sheriffRecommended = [
  sheriffEslint.configs.all,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@softarc/sheriff/deep-import': 'error',
      '@softarc/sheriff/encapsulation': 'error',
      '@softarc/sheriff/dependency-rule': 'error',
    },
  },
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  ...sheriffRecommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: false,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:libs'],
            },
            {
              sourceTag: 'type:libs',
              onlyDependOnLibsWithTags: ['type:libs'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\./\\.\\./\\.\\./',
              message:
                'Deep relative imports (../../../+) are forbidden; use path aliases or the module public API (index.ts / public-api.ts).',
            },
            {
              regex: '(^|/)apps\\/(main|admin)\\/src\\/app\\/',
              message: 'Cross-app imports are forbidden; applications must stay isolated.',
            },
            {
              group: ['libs/*/src/**', '@socioconnect/*/src/**'],
              message: 'Import through the library public API only.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/e2e-*/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@socioconnect/**', 'apps/**', 'libs/**', '**/apps/**', '**/libs/**'],
              message:
                'E2E must not import application or library source; use routes, selectors, and Playwright only.',
            },
            {
              regex: '^\\.\\./\\.\\./\\.\\./',
              message:
                'Deep relative imports are forbidden; keep E2E isolated from implementation paths.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error',
    },
  },
];
