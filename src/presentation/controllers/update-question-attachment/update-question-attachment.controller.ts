import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class UpdateQuestionAttachmentController implements WebController {
  constructor (private readonly updateQuestionAttachmentUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { attachmentId } = req.params
      const { title, url } = req.body
      const attachment = await this.updateQuestionAttachmentUseCase.execute({
        attachmentId,
        title,
        url,
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
