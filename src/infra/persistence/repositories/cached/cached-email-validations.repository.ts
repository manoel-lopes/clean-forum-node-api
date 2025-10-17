import type {
  EmailValidationsRepository,
  UpdateEmailValidationData,
} from '@/domain/application/repositories/email-validations.repository'
import { CachedEmailValidationsMapper } from '@/infra/persistence/mappers/cached/cached-email-validations.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { EmailValidation } from '@/domain/enterprise/entities/email-validation.entity'

export class CachedEmailValidationsRepository implements EmailValidationsRepository {
  private readonly keyPrefix = 'email-validations'

  constructor(
    private readonly redis: RedisService,
    private readonly emailValidationsRepository: EmailValidationsRepository,
  ) {}

  async create(emailValidation: EmailValidation): Promise<EmailValidation> {
    const createdEmailValidation = await this.emailValidationsRepository.create(emailValidation)
    await this.cacheEmailValidation(createdEmailValidation)
    return createdEmailValidation
  }

  async update(emailValidation: UpdateEmailValidationData): Promise<EmailValidation> {
    const updatedEmailValidation = await this.emailValidationsRepository.update(emailValidation)
    await this.redis.delete(this.emailValidationKey(emailValidation.where.id))
    await this.cacheEmailValidation(updatedEmailValidation)
    return updatedEmailValidation
  }

  async delete(id: string): Promise<void> {
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (!emailValidation) return
    await this.emailValidationsRepository.delete(id)
    await this.redis.delete(
      this.emailValidationKey(emailValidation.id),
      this.emailValidationEmailKey(emailValidation.email),
    )
  }

  async findById(id: string): Promise<EmailValidation | null> {
    const cached = await this.redis.get(this.emailValidationKey(id), CachedEmailValidationsMapper.toDomain)
    if (cached) return cached
    const emailValidation = await this.emailValidationsRepository.findById(id)
    if (emailValidation) {
      await this.cacheEmailValidation(emailValidation)
    }
    return emailValidation
  }

  async findByEmail(email: string): Promise<EmailValidation | null> {
    const cachedId = await this.redis.get(this.emailValidationEmailKey(email), (value) => value)
    if (cachedId) {
      const emailValidation = await this.findById(cachedId)
      if (emailValidation) return emailValidation
      await this.redis.delete(this.emailValidationEmailKey(email))
    }
    const emailValidation = await this.emailValidationsRepository.findByEmail(email)
    if (emailValidation) {
      await this.cacheEmailValidation(emailValidation)
    }
    return emailValidation
  }

  private emailValidationKey(id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private emailValidationEmailKey(email: string): string {
    return `${this.keyPrefix}:email:${email}`
  }

  private async cacheEmailValidation(emailValidation: EmailValidation): Promise<void> {
    await this.redis.set(
      this.emailValidationKey(emailValidation.id),
      CachedEmailValidationsMapper.toPersistence(emailValidation),
    )
    await this.redis.set(this.emailValidationEmailKey(emailValidation.email), emailValidation.id)
  }
}
