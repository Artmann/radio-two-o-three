import { captureException } from '@sentry/minimal'

export function reportError(error: any): void {
  console.error(error)

  captureException(error)
}
