import { uuidv7 } from 'uuidv7'
import type { EmailValidationsRepository } from '@/domain/application/repositories/email-validations.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { EmailValidation, EmailValidationProps } from '@/domain/enterprise/entities/email-validation.entity'

export class PrismaEmailValidationsRepository implements EmailValidationsRepository {
  async save (emailValidation: EmailValidationProps): Promise<EmailValidation> {
    const created = await prisma.emailValidation.upsert({
      where: { email: emailValidation.email },
      create: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        email: emailValidation.email,
        code: emailValidation.code,
        expiresAt: emailValidation.expiresAt,
        verified: emailValidation.isVerified,
      },
      update: {
        code: emailValidation.code,
        expiresAt: emailValidation.expiresAt,
        verified: emailValidation.isVerified,
        updatedAt: new Date(),
      },
    })
    return created as EmailValidation
  }

  async findByEmail (email: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { email }
    })
    return emailValidation as EmailValidation | null
  }

  async findById (id: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { id }
    })
    return emailValidation as EmailValidation | null
  }

  async delete (id: string): Promise<void> {
    await prisma.emailValidation.delete({
      where: { id }
    })
  }
}
