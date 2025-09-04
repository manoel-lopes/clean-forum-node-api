import { describe, expect, it } from 'vitest'
import { authRateLimit, emailValidationRateLimit, rateLimitPlugin, userCreationRateLimit } from '@/main/fastify/plugins/rate-limit'

describe('Rate Limiting Configuration', () => {
  describe('Rate Limiting Plugins', () => {
    it('should have correct configuration for authentication rate limiting', () => {
      expect(authRateLimit).toBeDefined()
      expect(authRateLimit.max).toBe(5)
      expect(authRateLimit.timeWindow).toBe('1 minute')
      expect(authRateLimit.keyGenerator).toBeTypeOf('function')
      expect(authRateLimit.errorResponseBuilder).toBeTypeOf('function')
    })

    it('should have correct configuration for user creation rate limiting', () => {
      expect(userCreationRateLimit).toBeDefined()
      expect(userCreationRateLimit.max).toBe(10)
      expect(userCreationRateLimit.timeWindow).toBe('1 minute')
      expect(userCreationRateLimit.keyGenerator).toBeTypeOf('function')
      expect(userCreationRateLimit.errorResponseBuilder).toBeTypeOf('function')
    })

    it('should have correct configuration for email validation rate limiting', () => {
      expect(emailValidationRateLimit).toBeDefined()
      expect(emailValidationRateLimit.max).toBe(3)
      expect(emailValidationRateLimit.timeWindow).toBe('5 minutes')
      expect(emailValidationRateLimit.keyGenerator).toBeTypeOf('function')
      expect(emailValidationRateLimit.errorResponseBuilder).toBeTypeOf('function')
    })

    it('should have rate limit plugin factory', () => {
      expect(rateLimitPlugin).toBeTypeOf('function')
    })
  })

  describe('Rate Limiting Error Messages', () => {
    it('should return correct error response for auth rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1', body: { email: 'test@example.com' } }
      const mockContext = { ttl: 60000 }

      const errorResponse = authRateLimit.errorResponseBuilder(mockRequest, mockContext)

      expect(errorResponse).toEqual({
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many authentication attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })

    it('should return correct error response for user creation rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1' }
      const mockContext = { ttl: 60000 }

      const errorResponse = userCreationRateLimit.errorResponseBuilder(mockRequest, mockContext)

      expect(errorResponse).toEqual({
        code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many account creation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })

    it('should return correct error response for email validation rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1', body: { email: 'test@example.com' } }
      const mockContext = { ttl: 300000 }

      const errorResponse = emailValidationRateLimit.errorResponseBuilder(mockRequest, mockContext)

      expect(errorResponse).toEqual({
        code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many email validation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })
  })

  describe('Key Generation', () => {
    it('should generate correct key for auth rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1', body: { email: 'test@example.com' } }
      const key = authRateLimit.keyGenerator(mockRequest)
      expect(key).toBe('127.0.0.1:auth:test@example.com')
    })

    it('should generate correct key for auth rate limiting without email', () => {
      const mockRequest = { ip: '127.0.0.1', body: {} }
      const key = authRateLimit.keyGenerator(mockRequest)
      expect(key).toBe('127.0.0.1:auth:127.0.0.1')
    })

    it('should generate correct key for user creation rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1' }
      const key = userCreationRateLimit.keyGenerator(mockRequest)
      expect(key).toBe('127.0.0.1:user_creation')
    })

    it('should generate correct key for email validation rate limiting', () => {
      const mockRequest = { ip: '127.0.0.1', body: { email: 'test@example.com' } }
      const key = emailValidationRateLimit.keyGenerator(mockRequest)
      expect(key).toBe('127.0.0.1:email:test@example.com')
    })

    it('should generate correct key for email validation rate limiting without email', () => {
      const mockRequest = { ip: '127.0.0.1', body: {} }
      const key = emailValidationRateLimit.keyGenerator(mockRequest)
      expect(key).toBe('127.0.0.1:email:127.0.0.1')
    })
  })
})
