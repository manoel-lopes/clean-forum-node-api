import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyRateLimit from '@fastify/rate-limit'
import type { HttpRequest } from '@/infra/http/ports/http-protocol'

type TtlContext = {
  ttl: number
}

export const rateLimitPlugin = () => {
  const CODE_RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
  const MESSAGE_RATE_LIMIT_EXCEEDED = 'Too Many Requests'
  const MESSAGE_RATE_LIMIT_EXCEEDED_DESCRIPTION = 'Rate limit exceeded. Please try again later.'
  return fastifyPlugin(
    async function (app: FastifyInstance) {
      await app.register(fastifyRateLimit, {
        global: false,
        max: 1000,
        timeWindow: '15 minutes',
        errorResponseBuilder: (_req, context) => {
          return {
            code: CODE_RATE_LIMIT_EXCEEDED,
            error: MESSAGE_RATE_LIMIT_EXCEEDED,
            message: MESSAGE_RATE_LIMIT_EXCEEDED_DESCRIPTION,
            retryAfter: Math.round(context.ttl / 1000)
          }
        },
        addHeaders: {
          'x-ratelimit-limit': true,
          'x-ratelimit-remaining': true,
          'x-ratelimit-reset': true,
          'retry-after': true
        },
        skipOnError: false
      })
    }
  )
}

export const authRateLimit = () => ({
  max: 5,
  timeWindow: '1 minute',
  keyGenerator: (req: HttpRequest) => {
    return `${req.ip}:auth:${req.body?.email || req.ip}`
  },
  errorResponseBuilder: (_req: HttpRequest, context: TtlContext) => {
    return {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      error: 'Too Many Requests',
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.round(context.ttl / 1000)
    }
  }
})

export const userCreationRateLimit = () => ({
  max: 10,
  timeWindow: '1 minute',
  keyGenerator: (req: HttpRequest) => {
    return `${req.ip}:user_creation`
  },
  errorResponseBuilder: (_req: HttpRequest, context: TtlContext) => {
    return {
      code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
      error: 'Too Many Requests',
      message: 'Too many account creation attempts. Please try again later.',
      retryAfter: Math.round(context.ttl / 1000)
    }
  }
})

export const emailValidationRateLimit = () => ({
  max: 10,
  timeWindow: '1 minute',
  keyGenerator: (req: HttpRequest) => {
    return `${req.ip}:email:${req.body?.email || req.ip}`
  },
  errorResponseBuilder: (_req: HttpRequest, context: TtlContext) => {
    return {
      code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
      error: 'Too Many Requests',
      message: 'Too many email validation attempts. Please try again later.',
      retryAfter: Math.round(context.ttl / 1000)
    }
  }
})
