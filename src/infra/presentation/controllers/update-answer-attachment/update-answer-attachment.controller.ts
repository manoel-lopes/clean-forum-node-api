import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type {
  updateAnswerAttachmentBodySchema,
  updateAnswerAttachmentParamsSchema,
} from './schemas/update-answer-attachment.protocol'

export class UpdateAnswerAttachmentController implements WebController {
  constructor (private readonly updateAnswerAttachmentUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof updateAnswerAttachmentBodySchema>
    params: z.infer<typeof updateAnswerAttachmentParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const { attachmentId } = req.params
      const { title, url } = req.body
      const attachment = await this.updateAnswerAttachmentUseCase.execute({
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
