import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import {
  UserWithEmailAlreadyRegisteredError,
} from '@/application/usecases/create-account/errors/user-with-email-already-registered.error'
import { created, conflict } from '@/presentation/helpers/http-helpers'

export class CreateAccountController implements WebController {
  constructor (
    private readonly schemaValidator: SchemaValidator,
    private readonly useCase: UseCase
  ) {
    Object.freeze(this)
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.schemaValidator.validate(req.body)
      await this.useCase.execute(request)
      return created()
    } catch (error) {
      if (error instanceof UserWithEmailAlreadyRegisteredError) {
        return conflict(error)
      }
      throw error
    }
  }
}
