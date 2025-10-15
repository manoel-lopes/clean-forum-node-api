import type { HttpRequest, HttpResponse } from '@/core/presentation/http'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchAnswerAttachmentsController implements WebController {
  constructor (private readonly fetchAnswerAttachmentsUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const { answerId } = req.params
    const attachments = await this.fetchAnswerAttachmentsUseCase.execute({
      answerId,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      order: order || 'desc'
    })
    return ok(attachments)
  }
}
