import { createRoot } from 'react-dom/client'

import { atlasConfig } from '@/config'
import { BUILD_ENV } from '@/config/env'
import { AssetLogger, SentryLogger } from '@/utils/logs'

import { App } from './App'

const initApp = async () => {
  if (BUILD_ENV === 'production') {
    SentryLogger.initialize(atlasConfig.analytics.sentry?.dsn)
    AssetLogger.initialize(atlasConfig.analytics.assetLogs?.url)
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container = document.getElementById('root')!
  const root = createRoot(container)
  root.render(<App />)
}

initApp()
