import { SendEmailValidationUseCase } from '@/domain/application/usecases/send-email-validation/send-email-validation.usecase'
import { QueuedEmailService } from '@/infra/adapters/email/queued-email/queued-email-service'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { EmailQueueService } from '@/infra/queue/email-queue.service'
import { SendEmailValidationController } from '@/presentation/controllers/send-email-validation/send-email-validation.controller'

export const makeSendEmailValidationController = (): SendEmailValidationController => {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const emailQueue = new EmailQueueService()
  const emailService = new QueuedEmailService(emailQueue)
  const sendEmailValidationUseCase = new SendEmailValidationUseCase(emailValidationsRepository, emailService)
  return new SendEmailValidationController(sendEmailValidationUseCase)
}
