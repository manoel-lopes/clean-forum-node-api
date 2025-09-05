import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

type CachedEmailValidation = Omit<EmailValidation, 'createdAt' | 'updatedAt' | 'code' | 'expiresAt'> & {
  createdAt: string
  updatedAt?: string
  code: string
  expiresAt: string
}

export class CachedEmailValidationsMapper extends BaseCachedMapper {
  static toDomain (cache: string): EmailValidation | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const code = EmailValidationCode.validate(item.code)
      const emailValidation = EmailValidation.create({
        email: item.email,
        code,
        expiresAt: new Date(item.expiresAt),
        isVerified: item.isVerified
      }, item.id)

      // Set the dates from cache
      Object.assign(emailValidation, {
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      })

      return emailValidation
    }
    return null
  }

  private static toDomainArray (cache: string): EmailValidation[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is EmailValidation => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedEmailValidation {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'id' in parsedCache &&
      typeof parsedCache.id === 'string' &&
      'email' in parsedCache &&
      typeof parsedCache.email === 'string' &&
      'code' in parsedCache &&
      typeof parsedCache.code === 'string' &&
      'expiresAt' in parsedCache &&
      typeof parsedCache.expiresAt === 'string' &&
      'isVerified' in parsedCache &&
      typeof parsedCache.isVerified === 'boolean' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      (!('updatedAt' in parsedCache) || typeof parsedCache.updatedAt === 'string')
  }
}
