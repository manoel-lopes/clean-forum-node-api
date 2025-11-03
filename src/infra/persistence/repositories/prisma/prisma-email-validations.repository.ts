import type {
  EmailValidationsRepository,
  UpdateEmailValidationData,
} from '@/domain/application/repositories/email-validations.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import { BasePrismaRepository } from '@/infra/persistence/repositories/prisma/base/base-prisma.repository'
import type { EmailValidation, EmailValidationProps } from '@/domain/enterprise/entities/email-validation.entity'

export class PrismaEmailValidationsRepository extends BasePrismaRepository implements EmailValidationsRepository {
  async create (data: EmailValidationProps): Promise<EmailValidation> {
    const emailValidation = await prisma.emailValidation.create({ data })
    return emailValidation
  }

  async update ({ where, data }: UpdateEmailValidationData): Promise<EmailValidation> {
    const updatedEmailValidation = await prisma.emailValidation.update({ where, data })
    return updatedEmailValidation
  }

  async findByEmail (email: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { email },
    })
    return emailValidation
  }

  async findById (emailValidationId: string): Promise<EmailValidation | null> {
    const emailValidation = await prisma.emailValidation.findUnique({
      where: { id: emailValidationId },
    })
    return emailValidation
  }

  async delete (emailValidationId: string) {
    await prisma.emailValidation.delete({
      where: { id: emailValidationId },
    })
  }
}
