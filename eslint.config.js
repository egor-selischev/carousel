import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

const SLICED_LAYERS = new Set(['pages', 'widgets', 'features', 'entities']);

const layersBelow = (layer) => FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1);

const layerPolicy = (layer) => {
  const slicedBelow = layersBelow(layer).filter((below) => SLICED_LAYERS.has(below));

  return {
    from: { element: { type: layer } },
    allow: {
      to: [
        ...(slicedBelow.length > 0
          ? [{ element: { types: { anyOf: slicedBelow }, fileInternalPath: 'index.ts' } }]
          : []),
        { element: { type: 'shared', fileInternalPath: '*/index.ts' } },
      ],
    },
  };
};

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      'no-console': 'error',
    },
  },

  {
    files: ['vite.config.ts'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json', alwaysTryTypes: true },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'pages', pattern: 'src/pages/*', capture: ['slice'] },
        { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
        { type: 'features', pattern: 'src/features/*/*', capture: ['group', 'slice'] },
        { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
        { type: 'shared', pattern: 'src/shared' },
      ],
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { allow: { to: { module: { origin: 'external' } } } },
            { allow: { dependency: { relationship: { to: 'internal' } } } },
            ...FSD_LAYERS.map(layerPolicy),
          ],
        },
      ],
    },
  },

  prettierConfig,
]);
