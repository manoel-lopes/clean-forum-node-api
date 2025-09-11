import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { CachedEmailValidationsMapper } from '@/infra/persistence/mappers/cached/cached-email-validations.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedEmailValidationsRepository extends BaseCachedRepository implements EmailValidationsRepository {
  private readonly keyPrefix = 'email-validations'

  constructor (
    redis: RedisService,
    private readonly emailValidationsRepository: EmailValidationsRepository
  ) {
    super(redis)
  }

  private emailValidationKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private emailValidationEmailKey (email: string): string {
    return this.emailKey(email)
  }

  private emailKey (email: string) {
    return `email-validations:email:${email}`
  }

  async save (emailValidation: EmailValidation): Promise<void> {
    await this.emailValidationsRepository.save(emailValidation)
    await this.cacheSet(this.emailValidationKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
    await this.cacheSet(this.emailValidationEmailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
  }

  async delete (id: string): Promise<void> {
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (!emailValidation) return
    await this.emailValidationsRepository.delete(id)
    await this.cacheDelete(this.emailValidationKey(emailValidation.id))
    await this.cacheDelete(this.emailValidationEmailKey(emailValidation.email))
  }

  async findById (id: string): Promise<EmailValidation | null> {
    const cached = await this.cacheGet(this.emailValidationKey(id))
    if (cached) {
      try {
        return CachedEmailValidationsMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.emailValidationKey(id))
      }
    }
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (emailValidation) {
      await this.cacheSet(this.emailValidationKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
      await this.cacheSet(this.emailValidationEmailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
    }
    return emailValidation
  }

  async findByEmail (email: string): Promise<EmailValidation | null> {
    const cached = await this.cacheGet(this.emailValidationEmailKey(email))
    if (cached) {
      try {
        return CachedEmailValidationsMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.emailValidationEmailKey(email))
      }
    }
    const emailValidation = await this.emailValidationsRepository.findByEmail(email)
    if (emailValidation) {
      await this.cacheSet(this.emailValidationKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
      await this.cacheSet(this.emailValidationEmailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
    }
    return emailValidation
  }
}
