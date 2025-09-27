import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { EmailAlreadyVerifiedError } from '@/application/usecases/verify-email-validation/errors/email-already-verified.error'
import { EmailValidationNotFoundError } from '@/application/usecases/verify-email-validation/errors/email-validation-not-found.error'
import { ExpiredValidationCodeError as AppExpiredValidationCodeError } from '@/application/usecases/verify-email-validation/errors/expired-validation-code.error'
import { ExpiredValidationCodeError } from '@/domain/entities/email-validation/errors/expired-validation-code.error'
import { InvalidValidationCodeError } from '@/domain/entities/email-validation/errors/invalid-validation-code.error'
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
      if (error instanceof AppExpiredValidationCodeError) {
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
