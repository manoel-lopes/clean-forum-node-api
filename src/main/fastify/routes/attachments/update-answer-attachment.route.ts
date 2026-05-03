import type { FastifyInstance } from 'fastify'
import {
  updateAnswerAttachmentBodySchema,
  updateAnswerAttachmentParamsSchema,
  updateAnswerAttachmentResponsesSchema,
} from '@/infra/presentation/controllers/update-answer-attachment/schemas/update-answer-attachment.protocol'
import { makeUpdateAnswerAttachmentController } from '@/main/factories/update-answer-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateAnswerAttachmentRoute (app: FastifyInstance, tags: string[]) {
  app.patch(
    '/attachments/:attachmentId',
    {
      schema: {
        tags,
        description: 'Update an answer attachment',
        params: updateAnswerAttachmentParamsSchema,
        body: updateAnswerAttachmentBodySchema,
        response: updateAnswerAttachmentResponsesSchema,
      },
    },
    adaptRoute(makeUpdateAnswerAttachmentController())
  )
}
