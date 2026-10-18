import { defineConfig } from '#q-app/wrappers'

type FileEnv = Record<string, string | boolean | null | undefined>

/**
 * Exposes only the hotel and chat-widget variables to the client bundle.
 * The LiteAPI key ships only when the live adapter is selected (sandbox keys only).
 */
const exposeHotelEnv = (fileEnv: FileEnv = {}): FileEnv => {
  const pick = (name: string, fallback: string) =>
    String(process.env[name] ?? fileEnv[name] ?? fallback)
  const adapter = pick('HOTEL_ADAPTER', 'mock')
  return {
    HOTEL_ADAPTER: adapter,
    LITEAPI_HOTEL_ID: pick('LITEAPI_HOTEL_ID', 'lp42e6e'),
    LITEAPI_KEY: adapter === 'liteapi' ? pick('LITEAPI_KEY', '') : '',
    SYRIVO_API_URL: pick('SYRIVO_API_URL', ''),
    SYRIVO_TENANT: pick('SYRIVO_TENANT', ''),
  }
}

export default defineConfig((ctx) => ({
  boot: ['~src/app/boot/repositories', '~src/app/boot/i18n', '~src/app/boot/syrivo-chat'],
  css: ['~src/app/styles/app.scss'],
  extras: ['material-icons'],

  sourceFiles: {
    rootComponent: 'src/app/App.vue',
    router: 'src/app/router/index',
    store: 'src/app/stores/index',
  },

  build: {
    target: { browser: ['es2022', 'firefox115', 'chrome115', 'safari16'], node: 'node22' },
    typescript: { strict: true, vueShim: true },
    vueRouterMode: 'history',
    envFiles: ctx.dev ? ['.env.development'] : [],
    envFilter: exposeHotelEnv,
  },

  devServer: { open: false, port: 9000 },

  framework: {
    iconSet: 'material-icons',
    config: {
      brand: {
        primary: '#1E4D8C',
        secondary: '#24292E',
        accent: '#F2B705',
        dark: '#24292E',
        positive: '#2E7D4F',
        negative: '#B3261E',
        info: '#1E4D8C',
        warning: '#F2B705',
      },
    },
    plugins: [],
  },
}))
