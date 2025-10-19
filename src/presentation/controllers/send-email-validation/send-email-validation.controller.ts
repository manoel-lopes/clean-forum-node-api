import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { SendEmailValidationError } from '@/domain/application/usecases/send-email-validation/errors/send-email-validation.error'
import { noContent, serviceUnavailable } from '@/presentation/helpers/http-helpers'

export class SendEmailValidationController implements WebController {
  constructor (private readonly sendEmailValidationUseCase: UseCase) {}

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
