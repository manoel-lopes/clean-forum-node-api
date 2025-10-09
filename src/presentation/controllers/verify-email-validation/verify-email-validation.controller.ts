import type { HttpRequest, HttpResponse } from '@/core/presentation/http'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { EmailAlreadyVerifiedError } from '@/domain/application/usecases/verify-email-validation/errors/email-already-verified.error'
import { EmailValidationNotFoundError } from '@/domain/application/usecases/verify-email-validation/errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from '@/domain/application/usecases/verify-email-validation/errors/expired-validation-code.error'
import { InvalidValidationCodeError } from '@/domain/application/usecases/verify-email-validation/errors/invalid-validation-code.error'
import { badRequest, noContent, notFound } from '@/presentation/helpers/http-helpers'

export class VerifyEmailValidationController implements WebController {
  constructor (private readonly verifyEmailValidationUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, code } = req.body
      await this.verifyEmailValidationUseCase.execute({ email, code })
      return noContent()
    } catch (error) {
      if (error instanceof EmailValidationNotFoundError) {
        return notFound(error)
      }
      if (error instanceof EmailAlreadyVerifiedError) {
        return badRequest(error)
      }
      if (error instanceof ExpiredValidationCodeError) {
        return badRequest(error)
      }
      if (error instanceof InvalidValidationCodeError) {
        return badRequest(error)
      }
      throw error
    }
  }
}
