import '@sentry/tracing'

import { init } from '@sentry/node'

export function setup() {
  init({
    dsn: 'https://2c152695eabe455b8589c3f6ce2c85bd@o1110961.ingest.sentry.io/6751033',
    tracesSampleRate: 0.25,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  })
}
