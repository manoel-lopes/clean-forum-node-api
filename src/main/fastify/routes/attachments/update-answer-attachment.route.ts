import type { FastifyInstance } from 'fastify'
import {
  updateAnswerAttachmentBodySchema,
  updateAnswerAttachmentParamsSchema,
  updateAnswerAttachmentResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/attachments/update-answer-attachment.schemas'
import { makeUpdateAnswerAttachmentController } from '@/main/factories/update-answer-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateAnswerAttachmentRoute(app: FastifyInstance, tags: string[]) {
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
    adaptRoute(makeUpdateAnswerAttachmentController()),
  )
}
