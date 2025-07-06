import { env } from '@/lib/env'

export class ErrorLogger {
  static log (error: Error) {
    if (env.NODE_ENV !== 'production') {
      console.error({ errors: error.message })
    } else {
      // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
    }
  }
}
