import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const layerBoundary = ({ files, group, message }) => ({
  files,
  rules: {
    'no-restricted-imports': ['error', { patterns: [{ group, message }] }],
  },
});

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: false, requireDefaultForNonUnion: true },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use an `as const` object and a derived union type.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'Render text through JSX; never inject HTML.',
        },
        {
          selector:
            'AssignmentExpression > MemberExpression.left[property.name=/^(innerHTML|outerHTML)$/]',
          message: 'Never assign HTML strings to the DOM.',
        },
        {
          selector: 'CallExpression[callee.property.name=/^(insertAdjacentHTML|write|writeln)$/]',
          message: 'Never write HTML strings to the DOM.',
        },
      ],
      'no-eval': 'error',
      'no-new-func': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  layerBoundary({
    files: ['src/domain/**'],
    group: [
      'react',
      'react-dom',
      'react/*',
      'react-dom/*',
      '**/features/**',
      '**/ui/**',
      '**/infrastructure/**',
    ],
    message: 'domain/ is pure TypeScript: no React, features, ui or infrastructure.',
  }),
  layerBoundary({
    files: ['src/infrastructure/**'],
    group: ['react', 'react-dom', 'react/*', 'react-dom/*', '**/features/**', '**/ui/**'],
    message: 'infrastructure/ implements domain contracts and never imports React or UI.',
  }),
  layerBoundary({
    files: ['src/features/**'],
    group: ['**/infrastructure/**'],
    message: 'features/ depend on domain contracts; concrete services are injected from app/.',
  }),
  layerBoundary({
    files: ['src/ui/**'],
    group: ['**/features/**', '**/domain/**', '**/infrastructure/**'],
    message: 'ui/ is presentational and knows nothing about features or domain.',
  }),
  {
    files: ['vite.config.ts', 'eslint.config.js'],
    rules: { 'no-restricted-exports': 'off' },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
