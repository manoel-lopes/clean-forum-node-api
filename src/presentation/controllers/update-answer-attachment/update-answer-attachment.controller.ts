import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class UpdateAnswerAttachmentController implements WebController {
  constructor(private readonly updateAnswerAttachmentUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { attachmentId } = req.params
      const { title, link } = req.body
      const attachment = await this.updateAnswerAttachmentUseCase.execute({
        attachmentId,
        title,
        link,
      })
      return ok(attachment)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
