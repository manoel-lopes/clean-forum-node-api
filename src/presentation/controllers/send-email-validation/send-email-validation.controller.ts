import type { WebController } from '@/core/presentation/web-controller'
import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { noContent } from '@/presentation/helpers/http-helpers'
import type { EmailService } from '@/application/services/email-service'

export class SendEmailValidationController implements WebController {
  constructor (
    private readonly emailValidationsRepository: EmailValidationsRepository,
    private readonly emailService: EmailService
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { email } = req.body
    const code = EmailValidationCode.create()
    const emailValidation = EmailValidation.createForEmail(email, code)
    await this.emailValidationsRepository.save(emailValidation)
    await this.emailService.sendValidationCode(email, code)
    return noContent()
  }
}
