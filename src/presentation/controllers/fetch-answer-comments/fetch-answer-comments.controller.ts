import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchAnswerCommentsController implements WebController {
  constructor(private readonly fetchAnswerCommentsUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize } = req.query
    const { answerId } = req.params
    const comments = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    })
    return ok(comments)
  }
}
