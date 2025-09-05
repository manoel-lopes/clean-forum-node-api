import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { CachedEmailValidationsMapper } from '@/infra/persistence/mappers/cached/cached-email-validations.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'

export class CachedEmailValidationsRepository implements EmailValidationsRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly emailValidationsRepository: EmailValidationsRepository
  ) {}

  async save (emailValidation: EmailValidation): Promise<void> {
    await this.emailValidationsRepository.save(emailValidation)
    await this.redis.set(this.entityKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
    await this.redis.set(this.emailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
  }

  async delete (id: string): Promise<void> {
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (!emailValidation) return
    await this.emailValidationsRepository.delete(id)
    await this.redis.delete(this.entityKey(emailValidation.id))
    await this.redis.delete(this.emailKey(emailValidation.email))
  }

  async findById (id: string): Promise<EmailValidation | null> {
    const cached = await this.redis.get(this.entityKey(id))
    if (cached) {
      try {
        return CachedEmailValidationsMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.entityKey(id))
      }
    }
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (emailValidation) {
      await this.redis.set(this.entityKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
      await this.redis.set(this.emailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
    }
    return emailValidation
  }

  async findByEmail (email: string): Promise<EmailValidation | null> {
    const cached = await this.redis.get(this.emailKey(email))
    if (cached) {
      try {
        return CachedEmailValidationsMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.emailKey(email))
      }
    }
    const emailValidation = await this.emailValidationsRepository.findByEmail(email)
    if (emailValidation) {
      await this.redis.set(this.entityKey(emailValidation.id), CachedEmailValidationsMapper.toPersistence(emailValidation))
      await this.redis.set(this.emailKey(emailValidation.email), CachedEmailValidationsMapper.toPersistence(emailValidation))
    }
    return emailValidation
  }

  private entityKey (id: string) {
    return `email-validations:${id}`
  }

  private emailKey (email: string) {
    return `email-validations:email:${email}`
  }
}
