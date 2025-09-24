import type { FastifyInstance } from 'fastify'
import { EmailServiceStub } from '@/infra/doubles/email-service.stub'
import { FastifyEmailService } from '@/infra/email/fastify-email-service'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { SendEmailValidationUseCase } from '@/application/usecases/send-email-validation/send-email-validation.usecase'
import { SendEmailValidationController } from '@/presentation/controllers/send-email-validation/send-email-validation.controller'
import { env } from '@/lib/env'

export const makeSendEmailValidationController = (fastify: FastifyInstance): SendEmailValidationController => {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const emailService = env.NODE_ENV === 'test'
    ? EmailServiceStub.getInstance()
    : new FastifyEmailService(fastify)
  const sendEmailValidationUseCase = new SendEmailValidationUseCase(emailValidationsRepository, emailService)
  return new SendEmailValidationController(sendEmailValidationUseCase)
}
