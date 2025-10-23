import pino from 'pino'
import { env } from './env'

const logLevels: Record<string, pino.Level> = {
  development: 'debug',
  test: 'fatal',
  production: 'info',
}

export const logger = pino({
  level: logLevels[env.NODE_ENV] || 'info',
  ...(env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})
