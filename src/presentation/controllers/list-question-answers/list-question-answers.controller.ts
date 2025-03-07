import type { WebController } from '@/core/presentation/web-controller'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export class ListQuestionAnswersController implements WebController {
  constructor (
    private readonly schemaValidator: SchemaValidator,
    private readonly listQuestionAnswersUseCase: UseCase
  ) {
    Object.freeze(this)
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.schemaValidator.validate(req)
      const response = await this.listQuestionAnswersUseCase.execute(request)
      return ok(response)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
