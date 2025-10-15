import type { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyRateLimit from '@fastify/rate-limit'
import {
  AuthRateLimitExceededError,
  EmailValidationRateLimitExceededError,
  ReadOperationsRateLimitExceededError,
  SendEmailValidationRateLimitExceededError,
  UserCreationRateLimitExceededError
} from '@/infra/http/errors/rate-limit-exceeded.error'

export const rateLimitPlugin = () => {
  return fastifyPlugin(async function (app: FastifyInstance) {
    await app.register(fastifyRateLimit, {
      global: false,
      max: 1000,
      timeWindow: '15 minutes',
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
        'retry-after': true,
      },
      skipOnError: true,
    })
  })
}

export const authRateLimit = () => ({
  max: 10,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => `${req.ip}:auth`,
  onExceeded: () => {
    throw new AuthRateLimitExceededError()
  },
})

export const userCreationRateLimit = () => ({
  max: 20,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => `${req.ip}:user_creation`,
  onExceeded: () => {
    throw new UserCreationRateLimitExceededError()
  },
})

export const sendEmailValidationRateLimit = () => ({
  max: 105,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => `${req.ip}:send_email_validation`,
  onExceeded: () => {
    throw new SendEmailValidationRateLimitExceededError()
  },
})

export const emailValidationRateLimit = () => ({
  max: 50,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => `${req.ip}:email_validation`,
  onExceeded: () => {
    throw new EmailValidationRateLimitExceededError()
  },
})

export const readOperationsRateLimit = () => ({
  max: 300,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => `${req.ip}:read_ops`,
  errorResponseBuilder: (_req: FastifyRequest, _context: { max: number, after: string }) => {
    const error = new ReadOperationsRateLimitExceededError()
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: error.message,
      code: error.code,
    }
  },
})
