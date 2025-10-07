import type { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyRateLimit from '@fastify/rate-limit'
import { AuthRateLimitExceededError, EmailValidationRateLimitExceededError, UserCreationRateLimitExceededError } from '@/infra/http/errors/rate-limit-exceeded.error'

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
  keyGenerator: (req: FastifyRequest) => {
    const { email } = req.body as { email: string }
    return `${req.ip}:auth:${email || req.ip}`
  },
  onExceeded: () => {
    throw new AuthRateLimitExceededError()
  },
})

export const userCreationRateLimit = () => ({
  max: 20,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => {
    return `${req.ip}:user_creation`
  },
  onExceeded: () => {
    throw new UserCreationRateLimitExceededError()
  },
})

export const emailValidationRateLimit = () => ({
  max: 20,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => {
    const { email } = req.body as { email: string }
    return `${req.ip}:email:${email}`
  },
  onExceeded: () => {
    throw new EmailValidationRateLimitExceededError()
  },
})

export const readOperationsRateLimit = () => ({
  max: 300,
  timeWindow: '1 minute',
  keyGenerator: (req: FastifyRequest) => {
    return `${req.ip}:read_ops`
  },
})
