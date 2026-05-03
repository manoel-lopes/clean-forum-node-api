import type { FastifyInstance } from 'fastify'
import {
  deleteAnswerAttachmentParamsSchema,
  deleteAnswerAttachmentResponsesSchema,
} from '@/infra/presentation/controllers/delete-answer-attachment/schemas/delete-answer-attachment.protocol'
import { makeDeleteAnswerAttachmentController } from '@/main/factories/delete-answer-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteAnswerAttachmentRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/attachments/:attachmentId',
    {
      schema: {
        tags,
        description: 'Delete an answer attachment',
        params: deleteAnswerAttachmentParamsSchema,
        response: deleteAnswerAttachmentResponsesSchema,
      },
    },
    adaptRoute(makeDeleteAnswerAttachmentController())
  )
}
