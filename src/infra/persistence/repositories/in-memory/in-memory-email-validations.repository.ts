import type { EmailValidationsRepository } from '@/domain/application/repositories/email-validations.repository'
import type { EmailValidation } from '@/domain/enterprise/entities/email-validation.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryEmailValidationsRepository extends BaseRepository<EmailValidation> implements EmailValidationsRepository {
  async findByEmail (email: string): Promise<EmailValidation | null> {
    const emailValidation = await this.findOneBy('email', email)
    return emailValidation
  }

  async delete (id: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === id)
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1)
    }
  }
}
