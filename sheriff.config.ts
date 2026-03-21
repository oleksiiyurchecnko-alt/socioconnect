import type { SheriffConfig } from '@softarc/sheriff-core';

type RuleMatcherFn = (ctx: {
  from: string;
  to: string;
  fromModulePath: string;
  toModulePath: string;
  fromFilePath: string;
  toFilePath: string;
}) => boolean;

const appSlug = (modulePath: string): string | undefined =>
  modulePath.match(/\/apps\/([^/]+)\//)?.[1];

const domainSlug = (modulePath: string): string | undefined =>
  modulePath.match(/\/src\/app\/domains\/([^/]+)\//)?.[1];

const featureSlug = (modulePath: string): string | undefined =>
  modulePath.match(/\/src\/app\/domains\/[^/]+\/feature\/([^/]+)\//)?.[1];

const isLibTarget = (to: string): boolean =>
  to === 'type:libs' || to.startsWith('kind:');

const isSameApp = (fromModulePath: string, toModulePath: string): boolean => {
  const fromApp = appSlug(fromModulePath);
  const toApp = appSlug(toModulePath);
  return fromApp !== undefined && fromApp === toApp;
};

const isSameDomain = (fromModulePath: string, toModulePath: string): boolean => {
  const fromDomain = domainSlug(fromModulePath);
  const toDomain = domainSlug(toModulePath);
  return fromDomain !== undefined && fromDomain === toDomain;
};

const isSameFeature = (fromModulePath: string, toModulePath: string): boolean => {
  const fromFeature = featureSlug(fromModulePath);
  const toFeature = featureSlug(toModulePath);
  return fromFeature !== undefined && fromFeature === toFeature;
};

const typeAppAllows: RuleMatcherFn = ({ to, fromModulePath, toModulePath }) =>
  isLibTarget(to) || (to !== 'type:e2e' && isSameApp(fromModulePath, toModulePath));

const scopeAllows: RuleMatcherFn = ({ from, to }) =>
  isLibTarget(to) || from === to;

const domainAllows: RuleMatcherFn = ({ from, to, fromModulePath, toModulePath }) =>
  isLibTarget(to) ||
  (from === to && isSameDomain(fromModulePath, toModulePath));

const entryAllows: RuleMatcherFn = ({ to, fromModulePath, toModulePath }) =>
  isLibTarget(to) || isSameApp(fromModulePath, toModulePath);

const bootstrapAllows: RuleMatcherFn = ({ to, fromModulePath, toModulePath }) =>
  isLibTarget(to) || isSameApp(fromModulePath, toModulePath);

const envAllows: RuleMatcherFn = ({ to }) => isLibTarget(to);

const uiAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:ui' ||
  to === 'layer:types' ||
  to === 'layer:utils' ||
  to === 'layer:constants' ||
  to === 'kind:ui' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants' ||
  to === 'type:libs';

const featureAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:feature' ||
  to === 'layer:ui' ||
  to === 'layer:data-access' ||
  to === 'layer:types' ||
  to === 'layer:utils' ||
  to === 'layer:constants' ||
  to === 'kind:ui' ||
  to === 'kind:data-access' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants' ||
  to === 'type:libs';

const featureSliceAllows: RuleMatcherFn = ({
  to,
  fromModulePath,
  toModulePath,
}) => {
  if (to.startsWith('feature:')) {
    return isSameFeature(fromModulePath, toModulePath);
  }
  return true;
};

const dataAccessAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:data-access' ||
  to === 'layer:types' ||
  to === 'layer:utils' ||
  to === 'layer:constants' ||
  to === 'kind:data-access' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants' ||
  to === 'type:libs';

const shellAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:data-access' ||
  to === 'layer:types' ||
  to === 'layer:utils' ||
  to === 'layer:constants' ||
  to === 'kind:data-access' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants' ||
  to === 'type:libs';

const typesAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:types' || to === 'kind:types' || to === 'type:libs';

const utilsAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:utils' ||
  to === 'layer:types' ||
  to === 'layer:constants' ||
  to === 'kind:utils' ||
  to === 'kind:types' ||
  to === 'kind:constants' ||
  to === 'type:libs';

const constantsAllows: RuleMatcherFn = ({ to }) =>
  to === 'layer:constants' ||
  to === 'layer:types' ||
  to === 'kind:constants' ||
  to === 'kind:types' ||
  to === 'type:libs';

const libsAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' || to.startsWith('kind:');

const kindTypesAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' || to === 'kind:types';

const kindUtilsAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' ||
  to === 'kind:utils' ||
  to === 'kind:types' ||
  to === 'kind:constants';

const kindConstantsAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' || to === 'kind:constants' || to === 'kind:types';

const kindUiAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' ||
  to === 'kind:ui' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants' ||
  to === 'kind:data-access';

const kindDataAccessAllows: RuleMatcherFn = ({ to }) =>
  to === 'type:libs' ||
  to === 'kind:data-access' ||
  to === 'kind:types' ||
  to === 'kind:utils' ||
  to === 'kind:constants';

const e2eAllows: RuleMatcherFn = ({ from, to }) => to === 'type:e2e' || from === to;

const rootAllows: RuleMatcherFn = ({ from, to }) =>
  from === 'root' && (to === 'root' || to === 'noTag');

const noTagAllows: RuleMatcherFn = ({ from, to, toModulePath }) => {
  if (from !== 'noTag') {
    return false;
  }
  if (to === 'noTag' || to === 'root' || isLibTarget(to)) {
    return true;
  }
  return toModulePath.startsWith('node_modules/');
};

export const config: SheriffConfig = {
  version: 1,
  enableBarrelLess: true,
  autoTagging: true,
  entryPoints: {
    main: 'apps/main/src/main.ts',
    admin: 'apps/admin/src/main.ts',
  },
  modules: {
    'apps/<app>/src': ['type:app', 'scope:<app>', 'layer:entry'],
    'apps/<app>/src/environments': ['type:app', 'scope:<app>', 'layer:env'],
    'apps/<app>/src/app': ['type:app', 'scope:<app>', 'layer:bootstrap'],
    'apps/<app>/src/app/domains/<domain>/ui': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:ui',
    ],
    'apps/<app>/src/app/domains/<domain>/feature/<feature>': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:feature',
      'feature:<feature>',
    ],
    'apps/<app>/src/app/domains/<domain>/data-access': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:data-access',
    ],
    'apps/<app>/src/app/domains/<domain>/shell': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:shell',
    ],
    'apps/<app>/src/app/domains/<domain>/types': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:types',
    ],
    'apps/<app>/src/app/domains/<domain>/utils': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:utils',
    ],
    'apps/<app>/src/app/domains/<domain>/constants': [
      'type:app',
      'scope:<app>',
      'domain:<domain>',
      'layer:constants',
    ],
    'apps/e2e-<suite>/src': ['type:e2e', 'scope:e2e-<suite>'],
    'libs/types/src': ['type:libs', 'kind:types'],
    'libs/utils/src': ['type:libs', 'kind:utils'],
    'libs/constants/src': ['type:libs', 'kind:constants'],
    'libs/ui-components/src': ['type:libs', 'kind:ui'],
    'libs/data-access/src': ['type:libs', 'kind:data-access'],
  },
  depRules: {
    root: [rootAllows],
    noTag: [noTagAllows],
    'type:app': [typeAppAllows],
    'scope:*': [scopeAllows],
    'domain:*': [domainAllows],
    'layer:entry': [entryAllows],
    'layer:bootstrap': [bootstrapAllows],
    'layer:env': [envAllows],
    'layer:ui': [uiAllows],
    'layer:feature': [featureAllows],
    'feature:*': [featureSliceAllows],
    'layer:data-access': [dataAccessAllows],
    'layer:shell': [shellAllows],
    'layer:types': [typesAllows],
    'layer:utils': [utilsAllows],
    'layer:constants': [constantsAllows],
    'type:libs': [libsAllows],
    'kind:types': [kindTypesAllows],
    'kind:utils': [kindUtilsAllows],
    'kind:constants': [kindConstantsAllows],
    'kind:ui': [kindUiAllows],
    'kind:data-access': [kindDataAccessAllows],
    'type:e2e': [e2eAllows],
    'scope:e2e-*': [e2eAllows],
  },
};
