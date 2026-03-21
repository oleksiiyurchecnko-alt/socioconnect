const componentScss = ['apps/*/src/app/**/*.component.scss', 'libs/ui-components/src/**/*.scss'];

const globalScss = [
  'apps/*/src/styles.scss',
  'apps/*/src/styles/**/*.scss',
  'apps/*/assets/fonts/**/*.scss',
];

const hardcodedColorPatterns = [/#[\da-fA-F]{3,8}\b/, /\brgba?\(/, /\bhsla?\(/];

module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.angular/**',
    '**/.nx/**',
    '**/tmp/**',
  ],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        'at-rule-disallowed-list': ['import'],
        'declaration-no-important': true,
        'declaration-property-value-disallowed-list': {
          '/color$/': hardcodedColorPatterns,
          background: hardcodedColorPatterns,
          'background-color': hardcodedColorPatterns,
          border: hardcodedColorPatterns,
          'border-top': hardcodedColorPatterns,
          'border-right': hardcodedColorPatterns,
          'border-bottom': hardcodedColorPatterns,
          'border-left': hardcodedColorPatterns,
          'border-color': hardcodedColorPatterns,
          'outline-color': hardcodedColorPatterns,
          fill: hardcodedColorPatterns,
          stroke: hardcodedColorPatterns,
          'box-shadow': hardcodedColorPatterns,
          'text-shadow': hardcodedColorPatterns,
        },
        'max-nesting-depth': 3,
        'no-descending-specificity': true,
        'order/properties-alphabetical-order': true,
        'property-no-unknown': true,
        'scss/at-use-no-redundant-alias': true,
        'selector-max-id': 0,
        'selector-pseudo-element-disallowed-list': ['ng-deep'],
        'unit-disallowed-list': [
          ['px'],
          {
            ignoreProperties: {
              px: [
                'border',
                'border-bottom',
                'border-bottom-width',
                'border-left',
                'border-left-width',
                'border-right',
                'border-right-width',
                'border-top',
                'border-top-width',
                'border-width',
                'box-shadow',
                'outline',
                'outline-width',
                'text-shadow',
              ],
            },
          },
        ],
      },
    },
    {
      files: globalScss,
      rules: {
        'selector-class-pattern': null,
        'selector-max-type': [
          2,
          {
            ignore: ['compounded', 'descendant'],
          },
        ],
      },
    },
    {
      files: ['apps/*/src/styles/tokens/**/*.scss'],
      rules: {
        'declaration-property-value-disallowed-list': null,
        'selector-class-pattern': null,
        'selector-max-type': 1,
        'unit-disallowed-list': null,
      },
    },
    {
      files: componentScss,
      rules: {
        'at-rule-disallowed-list': ['forward', 'import', 'use'],
        'selector-class-pattern':
          '^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*)(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
        'selector-disallowed-list': [/^html$/, /^body$/, /^:root$/, /^\[data-theme=.*\]$/],
        'selector-max-type': 0,
      },
    },
  ],
};
