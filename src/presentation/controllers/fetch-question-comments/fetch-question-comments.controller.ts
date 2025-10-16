import type { HttpRequest, HttpResponse } from '@/core/presentation/http'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchQuestionCommentsController implements WebController {
  constructor (private readonly fetchQuestionCommentsUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize } = req.query
    const { questionId } = req.params

    const comments = await this.fetchQuestionCommentsUseCase.execute({
      questionId,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10
    })
    return ok(comments)
  }
}
