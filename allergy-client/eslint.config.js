import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest
      }
    },
  },
  // Dexie guard
  // Only src/db/ may import the Dexie client
  // everything else goes through db/entries etc.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/db/**', 'src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/db/client'],
          message: 'Import from db module (e.g. db/entries), not the Dexie client.',
        }],
      }],
    },
  },
  eslintConfigPrettier,
])
