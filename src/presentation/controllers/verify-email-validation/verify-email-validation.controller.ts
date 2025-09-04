import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { EmailValidationNotFoundError } from '@/application/usecases/verify-email-validation/errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from '@/application/usecases/verify-email-validation/errors/expired-validation-code.error'
import { badRequest, notFound, ok } from '@/presentation/helpers/http-helpers'

export class VerifyEmailValidationController implements WebController {
  constructor (private readonly verifyEmailValidationUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, code } = req.body
      const result = await this.verifyEmailValidationUseCase.execute({ email, code })
      return ok(result)
    } catch (error) {
      if (error instanceof EmailValidationNotFoundError) {
        return notFound(error)
      }
      if (error instanceof ExpiredValidationCodeError) {
        return badRequest(error)
      }
      throw error
    }
  }
}
