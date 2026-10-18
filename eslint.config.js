import js from '@eslint/js'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

const pattern = (group, message) => ({ group, message })

const ADAPTERS = pattern(
  ['src/entities/*/api/*', '**/entities/*/api/*', '../api/*', 'src/shared/api/*', '@supabase/*'],
  'Depend on ports (entities/<slice>/model/ports.ts). Adapters are wired in app/boot/repositories.ts.',
)
const APP = pattern(['src/app/*'], 'Nothing imports the app layer.')
const PAGES = pattern(['src/pages/*'], 'Lower layers cannot import pages.')
const WIDGETS = pattern(['src/widgets/*'], 'Lower layers cannot import widgets.')
const FEATURES = pattern(['src/features/*'], 'Lower layers cannot import features.')
const ENTITIES = pattern(['src/entities/*'], 'shared cannot import entities.')

const restrict = (files, ...patterns) => ({
  files,
  ignores: ['**/*.test.ts'],
  rules: { 'no-restricted-imports': ['error', { patterns }] },
})

export default defineConfigWithVueTs(
  { ignores: ['dist', '.quasar', 'node_modules', 'quasar.config.*.temporary.compiled*'] },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
      },
    },
    rules: {
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
      'vue/multi-word-component-names': 'off',
      'vue/no-undef-components': [
        'error',
        { ignorePatterns: ['^q-', '^router-(link|view)$', '^i18n-t$', '^syrivo-chat$'] },
      ],
    },
  },
  restrict(['src/pages/**'], APP, ADAPTERS),
  restrict(['src/widgets/**'], APP, PAGES, ADAPTERS),
  restrict(['src/features/**'], APP, PAGES, WIDGETS, ADAPTERS),
  restrict(
    ['src/entities/*/model/**', 'src/entities/*/ui/**', 'src/entities/*/index.ts'],
    APP,
    PAGES,
    WIDGETS,
    FEATURES,
    ADAPTERS,
  ),
  restrict(
    ['src/entities/*/api/**'],
    APP,
    PAGES,
    WIDGETS,
    FEATURES,
    pattern(
      ['src/shared/api/supabase*'],
      'Adapters receive their client, never import the instance.',
    ),
  ),
  restrict(['src/shared/**'], APP, PAGES, WIDGETS, FEATURES, ENTITIES),
  restrict(
    ['src/shared/{ui,lib,i18n}/**'],
    APP,
    PAGES,
    WIDGETS,
    FEATURES,
    ENTITIES,
    pattern(['src/shared/api/*', '@supabase/*'], 'Only shared/api talks to backends.'),
  ),
  prettierSkipFormatting,
)
