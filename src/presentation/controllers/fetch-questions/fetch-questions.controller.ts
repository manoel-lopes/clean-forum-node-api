import type { WebController } from '@/core/presentation/web-controller'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchQuestionsController implements WebController {
  constructor (private readonly questionsRepository: QuestionsRepository) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const questions = await this.questionsRepository.findMany({ page, pageSize, order })
    return ok(questions)
  }
}
