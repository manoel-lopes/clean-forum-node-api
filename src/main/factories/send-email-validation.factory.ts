import type { FastifyInstance } from 'fastify'
import { SendEmailValidationUseCase } from '@/domain/application/usecases/send-email-validation/send-email-validation.usecase'
import { FastifyEmailService } from '@/infra/email/fastify-email-service'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { SendEmailValidationController } from '@/presentation/controllers/send-email-validation/send-email-validation.controller'

export const makeSendEmailValidationController = (fastify: FastifyInstance): SendEmailValidationController => {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const emailService = new FastifyEmailService(fastify)
  const sendEmailValidationUseCase = new SendEmailValidationUseCase(emailValidationsRepository, emailService)
  return new SendEmailValidationController(sendEmailValidationUseCase)
}
