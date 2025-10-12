import { SendEmailValidationUseCase } from '@/domain/application/usecases/send-email-validation/send-email-validation.usecase'
import { EmailQueueService } from '@/infra/adapters/email/services/email-queue.service'
import { QueuedEmailService } from '@/infra/adapters/email/services/queued-email-service'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { SendEmailValidationController } from '@/presentation/controllers/send-email-validation/send-email-validation.controller'

export const makeSendEmailValidationController = (): SendEmailValidationController => {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const emailQueue = new EmailQueueService()
  const emailService = new QueuedEmailService(emailQueue)
  const sendEmailValidationUseCase = new SendEmailValidationUseCase(emailValidationsRepository, emailService)
  return new SendEmailValidationController(sendEmailValidationUseCase)
}
