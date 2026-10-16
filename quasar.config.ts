import { defineConfig } from '#q-app/wrappers'

type FileEnv = Record<string, string | boolean | null | undefined>

/**
 * Exposes only the hotel variables to the client bundle.
 * The API key ships only when the real Makcorps adapter is selected.
 */
const exposeHotelEnv = (fileEnv: FileEnv = {}): FileEnv => {
  const adapter = String(process.env.HOTEL_ADAPTER ?? fileEnv.HOTEL_ADAPTER ?? 'mock')
  const hotelId = String(process.env.HOTEL_MAKCORPS_ID ?? fileEnv.HOTEL_MAKCORPS_ID ?? '229689')
  const apiKey = adapter === 'makcorps' ? String(fileEnv.HOTEL_API_KEY ?? '') : ''
  return { HOTEL_ADAPTER: adapter, HOTEL_MAKCORPS_ID: hotelId, HOTEL_API_KEY: apiKey }
}

export default defineConfig((ctx) => ({
  boot: ['~src/app/boot/repositories', '~src/app/boot/i18n'],
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
