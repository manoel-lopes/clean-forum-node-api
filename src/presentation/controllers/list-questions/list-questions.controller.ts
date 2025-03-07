import type { WebController } from '@/core/presentation/web-controller'
import type {
  QuestionsRepository,
} from '@/application/repositories/questions.repository'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ok } from '@/presentation/helpers/http-helpers'
import type { PaginationParams } from '@/core/application/pagination-params'

export class ListQuestionsController implements WebController {
  constructor (
    private readonly schemaValidator: SchemaValidator<unknown, PaginationParams>,
    private readonly questionsRepository: QuestionsRepository
  ) {
    Object.freeze(this)
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const request = this.schemaValidator.validate(req)
    const questions = await this.questionsRepository.findMany(request)
    return ok(questions)
  }
}
