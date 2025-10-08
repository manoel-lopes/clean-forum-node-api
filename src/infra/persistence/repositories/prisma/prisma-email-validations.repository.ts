import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { PrismaEmailValidationMapper } from '@/infra/persistence/mappers/prisma/prisma-email-validation.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'

export class PrismaEmailValidationsRepository implements EmailValidationsRepository {
  async save (emailValidation: EmailValidation): Promise<void> {
    const data = PrismaEmailValidationMapper.toPersistence(emailValidation)
    await prisma.emailValidation.upsert({
      where: { email: emailValidation.email },
      create: data,
      update: {
        code: data.code,
        expiresAt: data.expiresAt,
        isVerified: data.isVerified,
        updatedAt: data.updatedAt,
      },
    })
  }

  async findByEmail (email: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { email }
    })
    if (!emailValidation) return null
    return PrismaEmailValidationMapper.toDomain(emailValidation)
  }

  async findById (id: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { id }
    })
    if (!emailValidation) return null
    return PrismaEmailValidationMapper.toDomain(emailValidation)
  }

  async delete (id: string): Promise<void> {
    await prisma.emailValidation.delete({
      where: { id }
    })
  }
}
