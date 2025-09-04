import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { VerifyEmailValidationUseCase } from '@/application/usecases/verify-email-validation/verify-email-validation.usecase'
import { VerifyEmailValidationController } from '@/presentation/controllers/verify-email-validation/verify-email-validation.controller'

export function makeVerifyEmailValidationController (): WebController {
  const emailValidationsRepository = CachedRepositoriesFactory.createEmailValidationsRepository()
  const verifyEmailValidationUseCase = new VerifyEmailValidationUseCase(emailValidationsRepository)
  return new VerifyEmailValidationController(verifyEmailValidationUseCase)
}
