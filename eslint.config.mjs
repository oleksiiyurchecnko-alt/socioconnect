import nx from '@nx/eslint-plugin';

const crossDomainImportMessage =
  'Do not import another app domain from here. Use the same domain, app shared/, or @socioconnect/* libraries.';

const dashboardDomainLayers = [
  'apps/*/src/app/dashboard/feature/**/*.ts',
  'apps/*/src/app/dashboard/ui/**/*.ts',
  'apps/*/src/app/dashboard/data-access/**/*.ts',
  'apps/*/src/app/dashboard/utils/**/*.ts',
  'apps/*/src/app/dashboard/types/**/*.ts',
];

const clientsDomainLayers = [
  'apps/*/src/app/clients/feature/**/*.ts',
  'apps/*/src/app/clients/ui/**/*.ts',
  'apps/*/src/app/clients/data-access/**/*.ts',
  'apps/*/src/app/clients/utils/**/*.ts',
  'apps/*/src/app/clients/types/**/*.ts',
];

const appDomainImportBans = [
  {
    files: dashboardDomainLayers,
    patterns: [{ group: ['**/clients/**'], message: crossDomainImportMessage }],
  },
  {
    files: clientsDomainLayers,
    patterns: [{ group: ['**/dashboard/**'], message: crossDomainImportMessage }],
  },
];

const domainDirectLayerRegex =
  '^\\.\\/([\\w-]+)\\/(feature|ui|data-access|utils|types)\\/';

const appRoutesOnlyShellMessage =
  'app.routes.ts may only pull in domain route arrays from <domain>/shell/*. Do not import feature, ui, data-access, utils, types, or shared here.';

const appRootNoDirectDomainLayersMessage =
  'App root files must not import domain implementation folders. Compose routing via <domain>/shell only; use shared/ only for cross-cutting app wiring.';

const shellOnlyFeatureMessage =
  'Domain shell may import only ../feature/* (route targets). Do not import ui, data-access, utils, types, or app shared/ from shell.';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:shell',
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:constants',
                'type:types',
              ],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:constants',
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
                'type:constants',
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:constants',
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:util',
                'type:constants',
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: [
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:constants',
              onlyDependOnLibsWithTags: [
                'type:types',
                'scope:shared',
                'scope:lib',
              ],
            },
            {
              sourceTag: 'type:types',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:lib'],
            },
            {
              sourceTag: 'scope:domain',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:lib'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:lib'],
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/*/src/app/app.routes.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: domainDirectLayerRegex,
              message: appRoutesOnlyShellMessage,
            },
            {
              regex: '^\\.\\/shared\\/',
              message: appRoutesOnlyShellMessage,
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'apps/*/src/app/app.ts',
      'apps/*/src/app/app.config.ts',
      'apps/*/src/app/app.spec.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: domainDirectLayerRegex,
              message: appRootNoDirectDomainLayersMessage,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/*/src/app/*/shell/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\./(ui|data-access|utils|types)/',
              message: shellOnlyFeatureMessage,
            },
            {
              regex: '^\\.\\./\\.\\./shared/',
              message: shellOnlyFeatureMessage,
            },
          ],
        },
      ],
    },
  },
  ...appDomainImportBans.map(({ files, patterns }) => ({
    files,
    rules: {
      'no-restricted-imports': ['error', { patterns }],
    },
  })),
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
    },
  },
];
