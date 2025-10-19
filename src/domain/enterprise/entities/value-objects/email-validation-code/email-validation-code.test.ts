import { EmailValidationCode } from './email-validation-code.vo'

describe('EmailValidationCode', () => {
  describe('create', () => {
    it('should create a 6-digit validation code', () => {
      const code = EmailValidationCode.create()

      expect(code.value).toMatch(/^\d{6}$/)
    })

    it('should create different codes on multiple calls', () => {
      const code1 = EmailValidationCode.create()
      const code2 = EmailValidationCode.create()
      expect(code1.value).not.toBe(code2.value)
    })
  })

  describe('validate', () => {
    it('should create instance from valid 6-digit string', () => {
      const validCode = '123456'

      const code = EmailValidationCode.validate(validCode)
      expect(code.value).toBe(validCode)
    })

    it('should throw error for invalid code format - too short', () => {
      expect(() => EmailValidationCode.validate('12345')).toThrow(
        'Invalid email validation code: 12345. Code must be exactly 6 digits.'
      )
    })

    it('should throw error for invalid code format - too long', () => {
      expect(() => EmailValidationCode.validate('1234567')).toThrow(
        'Invalid email validation code: 1234567. Code must be exactly 6 digits.'
      )
    })

    it('should throw error for invalid code format - contains letters', () => {
      expect(() => EmailValidationCode.validate('12345a')).toThrow(
        'Invalid email validation code: 12345a. Code must be exactly 6 digits.'
      )
    })

    it('should throw error for invalid code format - contains special characters', () => {
      expect(() => EmailValidationCode.validate('12345!')).toThrow(
        'Invalid email validation code: 12345!. Code must be exactly 6 digits.'
      )
    })
  })

  describe('equals', () => {
    it('should return true for equal codes', () => {
      const code1 = EmailValidationCode.validate('123456')
      const code2 = EmailValidationCode.validate('123456')
      expect(code1.equals(code2)).toBe(true)
    })

    it('should return false for different codes', () => {
      const code1 = EmailValidationCode.validate('123456')
      const code2 = EmailValidationCode.validate('654321')
      expect(code1.equals(code2)).toBe(false)
    })
  })
})
