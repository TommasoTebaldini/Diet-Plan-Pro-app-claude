import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.claude/**',
      '.vercel/**',
      'android/**',
      'ios/**',
      'public/**',
      // Large generated/data files — data literals, not hand-written logic.
      'src/data/all-foods.js',
      'src/data/foods.js',
      'src/data/quizQuestions.js',
      'src/data/consigliBase.js',
      'src/data/crea-foods.js',
      'src/sw.js',
      'check_app.mjs', // gitignored personal scratch script
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // eslint-plugin-react-hooks v7's "recommended" preset assumes adoption
      // of the React Compiler (purity, immutability, set-state-in-effect...) —
      // this app doesn't use it, so those rules would flag long-standing,
      // legitimate patterns as errors. Keep just the two classic, load-bearing
      // hook rules that catch real bugs regardless of compiler usage.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['*.config.js', 'generate-*.js', 'generate-*.cjs', 'api/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      // These offline codegen scripts assign via eval(`x = ${...}`) to parse
      // literal arrays out of another repo's file — ESLint can't see into the
      // eval string, so it reads as "declared but never assigned".
      'no-unassigned-vars': 'off',
    },
  },
  prettier,
];
