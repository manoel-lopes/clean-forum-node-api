import type { FastifyInstance } from 'fastify'
import { FastifyEmailService } from '@/infra/email/fastify-email-service'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { SendEmailValidationController } from '@/presentation/controllers/send-email-validation/send-email-validation.controller'
import { env } from '@/lib/env'

export const makeSendEmailValidationController = (fastify: FastifyInstance): SendEmailValidationController => {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const emailService = new FastifyEmailService(fastify, env.EMAIL_FROM || 'noreply@cleanforum.com')
  return new SendEmailValidationController(emailValidationsRepository, emailService)
}
