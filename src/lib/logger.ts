import pino from 'pino'
import { env } from './env'

const logLevels: Record<string, pino.Level> = {
  development: 'debug',
  test: 'fatal',
  production: 'info'
}

export const logger = pino({
  level: logLevels[env.NODE_ENV] || 'info',
  transport: env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label }
    }
  },
  timestamp: pino.stdTimeFunctions.isoTime
})
