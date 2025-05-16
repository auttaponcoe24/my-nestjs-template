import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';

const eslintConfig = [
  ...tseslint.configs.recommended,
  prettierPlugin, // รวม Prettier auto-format
  {
    ignores: ['node_modules', 'dist', 'coverage', '**/*.d.ts', 'eslint.config.mjs'],
  },
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // General
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'import/no-anonymous-default-export': 'off',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
    },
  },
];

export default eslintConfig;
