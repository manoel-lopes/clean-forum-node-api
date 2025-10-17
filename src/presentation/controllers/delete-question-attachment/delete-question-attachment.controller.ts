import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { noContent, notFound } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class DeleteQuestionAttachmentController implements WebController {
  constructor(private readonly deleteQuestionAttachmentUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { attachmentId } = req.params
      await this.deleteQuestionAttachmentUseCase.execute({
        attachmentId,
      })
      return noContent()
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
