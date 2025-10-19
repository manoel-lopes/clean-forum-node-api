import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchUserQuestionsController implements WebController {
  constructor (private readonly fetchUserQuestionsUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { userId } = req.params
    const { page, pageSize, order } = req.query
    const questions = await this.fetchUserQuestionsUseCase.execute({ userId, page, pageSize, order })
    return ok(questions)
  }
}
