import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { EmailValidation } from './email-validation.entity'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'
import { InvalidValidationCodeError } from './errors/invalid-validation-code.error'

describe('EmailValidation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('create', () => {
    it('should create an email validation', () => {
      const code = EmailValidationCode.create()
      const expiresAt = new Date()
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(emailValidation.email).toBe('user@example.com')
      expect(emailValidation.code).toBe(code)
      expect(emailValidation.expiresAt).toBe(expiresAt)
      expect(emailValidation.isVerified).toBe(false)
      expect(emailValidation.id).toBeDefined()
    })
  })

  describe('createForEmail', () => {
    it('should create an unverified email validation with default expiration of 10 minutes', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.create()
      const emailValidation = EmailValidation.createForEmail('user@example.com', code)

      expect(emailValidation.email).toBe('user@example.com')
      expect(emailValidation.code).toBe(code)
      expect(emailValidation.isVerified).toBe(false)

      const expectedExpiration = new Date('2024-01-01T10:10:00')
      expect(emailValidation.expiresAt).toEqual(expectedExpiration)
    })

    it('should create an email validation with custom expiration minutes', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.create()
      const emailValidation = EmailValidation.createForEmail('user@example.com', code, 30)

      const expectedExpiration = new Date('2024-01-01T10:30:00')
      expect(emailValidation.expiresAt).toEqual(expectedExpiration)
    })
  })

  describe('verify', () => {
    it('should verify email validation with correct code', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.validate('123456')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      const verifiedValidation = emailValidation.verify(code)

      expect(verifiedValidation.isVerified).toBe(true)
      expect(verifiedValidation.email).toBe('user@example.com')
      expect(verifiedValidation.code).toBe(code)
      expect(verifiedValidation.expiresAt).toBe(expiresAt)
    })

    it('should throw ExpiredValidationCodeError when validation is expired', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.validate('123456')
      const expiresAt = new Date('2024-01-01T09:50:00') // Expired 10 minutes ago
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(() => emailValidation.verify(code)).toThrow(ExpiredValidationCodeError)
    })

    it('should throw InvalidValidationCodeError when code does not match', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.validate('123456')
      const wrongCode = EmailValidationCode.validate('654321')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(() => emailValidation.verify(wrongCode)).toThrow(InvalidValidationCodeError)
    })

    it('should throw InvalidValidationCodeError when already verified', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.validate('123456')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: true
      })

      expect(() => emailValidation.verify(code)).toThrow(InvalidValidationCodeError)
    })
  })

  describe('isExpired', () => {
    it('should return true when current time is after expiresAt', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.create()
      const expiresAt = new Date('2024-01-01T09:50:00')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(emailValidation.isExpired()).toBe(true)
    })

    it('should return false when current time is before expiresAt', () => {
      const now = new Date('2024-01-01T10:00:00')
      vi.setSystemTime(now)

      const code = EmailValidationCode.create()
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(emailValidation.isExpired()).toBe(false)
    })
  })

  describe('isCodeValid', () => {
    it('should return true when code matches and not verified', () => {
      const code = EmailValidationCode.validate('123456')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt: new Date(),
        isVerified: false
      })

      expect(emailValidation.isCodeValid(code)).toBe(true)
    })

    it('should return false when code does not match', () => {
      const code = EmailValidationCode.validate('123456')
      const wrongCode = EmailValidationCode.validate('654321')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt: new Date(),
        isVerified: false
      })

      expect(emailValidation.isCodeValid(wrongCode)).toBe(false)
    })

    it('should return false when already verified', () => {
      const code = EmailValidationCode.validate('123456')
      const emailValidation = EmailValidation.create({
        email: 'user@example.com',
        code,
        expiresAt: new Date(),
        isVerified: true
      })

      expect(emailValidation.isCodeValid(code)).toBe(false)
    })
  })
})
