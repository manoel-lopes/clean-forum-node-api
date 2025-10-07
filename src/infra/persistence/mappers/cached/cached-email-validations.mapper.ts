import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { EmailValidation as EmailValidationType } from '@/domain/enterprise/entities/email-validation.entity'
import { EmailValidationCode } from '@/domain/enterprise/value-objects/email-validation-code/email-validation-code.vo'

type CachedEmailValidation = Omit<EmailValidationType, 'createdAt' | 'updatedAt' | 'code' | 'expiresAt'> & {
  createdAt: string
  updatedAt?: string
  code: string
  expiresAt: string
}

export class CachedEmailValidationsMapper extends BaseCachedMapper {
  static toDomain (cache: string): EmailValidationType | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const code = EmailValidationCode.create(item.code)
      return {
        id: item.id,
        email: item.email,
        code,
        expiresAt: new Date(item.expiresAt),
        isVerified: item.isVerified,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }
    }
    return null
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
