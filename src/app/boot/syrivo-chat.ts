import { defineBoot } from '#q-app/wrappers'
import { mountSyrivoWidget, readSyrivoWidgetConfig } from 'src/features/syrivo-chat'

/** Loads the Syrivo chat widget when SYRIVO_API_URL and SYRIVO_TENANT are set for this build. */
export default defineBoot(() => {
  const config = readSyrivoWidgetConfig(process.env.SYRIVO_API_URL, process.env.SYRIVO_TENANT)
  if (config) mountSyrivoWidget(config)
})
