import { uuidv7 } from 'uuidv7'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { EmailValidation } from './email-validation.entity'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'
import { InvalidValidationCodeError } from './errors/invalid-validation-code.error'

describe('EmailValidation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const now = new Date('2024-01-01T10:00:00')
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create an email validation', () => {
    const code = EmailValidationCode.validate('123456')
    const expiresAt = new Date('2024-01-01T10:10:00.000Z')

    const emailValidation = EmailValidation.create({
      email: 'jhondoe@example.com',
      code,
      expiresAt,
      isVerified: false
    })

    expect(emailValidation.email).toBe('jhondoe@example.com')
    expect(emailValidation.code).toBe(code)
    expect(emailValidation.expiresAt).toBe(expiresAt)
    expect(emailValidation.isVerified).toBe(false)
    expect(emailValidation.id).toBeDefined()
    expect(emailValidation.createdAt).toBeInstanceOf(Date)
  })

  it('should recreate an email validation from existing data', () => {
    const existingId = uuidv7()
    const code = EmailValidationCode.validate('123456')
    const expiresAt = new Date('2024-01-01T10:10:00.000Z')
    const createdAt = new Date('2024-01-01T10:00:00.000Z')

    const emailValidation = EmailValidation.create({
      email: 'jhondoe@example.com',
      code,
      expiresAt,
      isVerified: true,
      createdAt
    }, existingId)

    expect(emailValidation.id).toBe(existingId)
    expect(emailValidation.email).toBe('jhondoe@example.com')
    expect(emailValidation.code).toBe(code)
    expect(emailValidation.expiresAt).toBe(expiresAt)
    expect(emailValidation.isVerified).toBe(true)
    expect(emailValidation.createdAt).toBe(createdAt)
  })

  describe('createForEmail', () => {
    it('should create an unisVerified email validation with default expiration of 10 minutes', () => {
      const code = EmailValidationCode.create()

      const emailValidation = EmailValidation.createForEmail('jhondoe@example.com', code)

      expect(emailValidation.email).toBe('jhondoe@example.com')
      expect(emailValidation.code).toBe(code)
      expect(emailValidation.isVerified).toBe(false)
      const expectedExpiration = new Date('2024-01-01T10:10:00')
      expect(emailValidation.expiresAt).toEqual(expectedExpiration)
    })

    it('should create an email validation with custom expiration minutes', () => {
      const code = EmailValidationCode.create()

      const emailValidation = EmailValidation.createForEmail('jhondoe@example.com', code, 30)

      const expectedExpiration = new Date('2024-01-01T10:30:00')
      expect(emailValidation.expiresAt).toEqual(expectedExpiration)
    })
  })

  describe('verify', () => {
    it('should verify email validation with correct code', () => {
      const code = EmailValidationCode.validate('123456')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      const isVerifiedValidation = emailValidation.verify(code)

      expect(isVerifiedValidation.isVerified).toBe(true)
      expect(isVerifiedValidation.email).toBe('jhondoe@example.com')
      expect(isVerifiedValidation.code).toBe(code)
      expect(isVerifiedValidation.expiresAt).toBe(expiresAt)
    })

    it('should throw an error when validation is expired', () => {
      const code = EmailValidationCode.validate('123456')
      const dateExpiredTenMinutesAgo = new Date('2024-01-01T09:50:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt: dateExpiredTenMinutesAgo,
        isVerified: false
      })

      expect(() => emailValidation.verify(code)).toThrow(ExpiredValidationCodeError)
    })

    it('should throw an error when the code does not match', () => {
      const code = EmailValidationCode.validate('123456')
      const wrongCode = EmailValidationCode.validate('654321')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(() => emailValidation.verify(wrongCode)).toThrow(InvalidValidationCodeError)
    })

    it('should throw an error when the code is already isVerified', () => {
      const code = EmailValidationCode.validate('123456')
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt,
        isVerified: true
      })

      expect(() => emailValidation.verify(code)).toThrow(InvalidValidationCodeError)
    })
  })

  describe('isExpired', () => {
    it('should return true when the code is expired', () => {
      const code = EmailValidationCode.create()
      const expiresAt = new Date('2024-01-01T09:50:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(emailValidation.isExpired()).toBe(true)
    })

    it('should return false when current time is before expiresAt', () => {
      const code = EmailValidationCode.create()
      const expiresAt = new Date('2024-01-01T10:10:00')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt,
        isVerified: false
      })

      expect(emailValidation.isExpired()).toBe(false)
    })
  })

  describe('isValid', () => {
    it('should return true when code matches and not isVerified', () => {
      const code = EmailValidationCode.validate('123456')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt: new Date('2024-01-01T10:10:00'),
        isVerified: false
      })

      expect(emailValidation.isValid(code)).toBe(true)
    })

    it('should return false when the code does not match', () => {
      const code = EmailValidationCode.validate('123456')
      const wrongCode = EmailValidationCode.validate('654321')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt: new Date('2024-01-01T10:10:00'),
        isVerified: false
      })

      expect(emailValidation.isValid(wrongCode)).toBe(false)
    })

    it('should return false when already isVerified', () => {
      const code = EmailValidationCode.validate('123456')
      const emailValidation = EmailValidation.create({
        email: 'jhondoe@example.com',
        code,
        expiresAt: new Date('2024-01-01T10:10:00'),
        isVerified: true
      })

      expect(emailValidation.isValid(code)).toBe(false)
    })
  })
})
