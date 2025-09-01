import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchAnswerCommentsController implements WebController {
  constructor (private readonly fetchAnswerCommentsUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, perPage } = req.query
    const { answerId } = req.params
    const comments = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page: page ? Number(page) : 1,
      pageSize: perPage ? Number(perPage) : 20
    })
    return ok(comments)
  }
}
