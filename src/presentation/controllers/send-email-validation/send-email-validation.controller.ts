import type { WebController } from '@/core/presentation/web-controller'
import { SendEmailValidationError } from '@/domain/application/usecases/send-email-validation/errors/send-email-validation.error'
import type { SendEmailValidationUseCase } from '@/domain/application/usecases/send-email-validation/send-email-validation.usecase'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { noContent, serviceUnavailable } from '@/presentation/helpers/http-helpers'

export class SendEmailValidationController implements WebController {
  constructor (
    private readonly sendEmailValidationUseCase: SendEmailValidationUseCase
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      await this.sendEmailValidationUseCase.execute({ email: req.body.email })
      return noContent()
    } catch (error) {
      if (error instanceof SendEmailValidationError) {
        return serviceUnavailable(error)
      }
      throw error
    }
  }
}
