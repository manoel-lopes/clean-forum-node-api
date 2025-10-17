import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchQuestionAttachmentsController implements WebController {
  constructor(private readonly fetchQuestionAttachmentsUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const { questionId } = req.params
    const attachments = await this.fetchQuestionAttachmentsUseCase.execute({
      questionId,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      order: order || 'desc',
    })
    return ok(attachments)
  }
}
