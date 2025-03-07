import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import {
  InvalidPasswordError,
} from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import { ok, notFound, unauthorized } from '@/presentation/helpers/http-helpers'

export class AuthenticateUserController implements WebController {
  constructor (
    private readonly schemaValidator: SchemaValidator,
    private readonly useCase: UseCase
  ) {
    Object.freeze(this)
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.schemaValidator.validate(req.body)
      const response = await this.useCase.execute(request)
      return ok(response)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }

      if (error instanceof InvalidPasswordError) {
        return unauthorized(error)
      }
      throw error
    }
  }
}
