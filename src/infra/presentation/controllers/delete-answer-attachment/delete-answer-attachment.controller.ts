import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { noContent, notFound } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type { deleteAnswerAttachmentParamsSchema } from './schemas/delete-answer-attachment.protocol'

export class DeleteAnswerAttachmentController implements WebController {
  constructor (private readonly deleteAnswerAttachmentUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof deleteAnswerAttachmentParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const { attachmentId } = req.params
      await this.deleteAnswerAttachmentUseCase.execute({
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
