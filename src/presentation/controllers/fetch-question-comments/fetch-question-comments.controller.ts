import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchQuestionCommentsController implements WebController {
  constructor (private readonly fetchQuestionCommentsUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, perPage } = req.query
    const { questionId } = req.params
    const comments = await this.fetchQuestionCommentsUseCase.execute({
      questionId,
      page: page ? Number(page) : 1,
      pageSize: perPage ? Number(perPage) : 10
    })
    return ok(comments)
  }
}
