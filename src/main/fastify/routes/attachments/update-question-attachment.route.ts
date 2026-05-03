import type { FastifyInstance } from 'fastify'
import {
  updateQuestionAttachmentBodySchema,
  updateQuestionAttachmentParamsSchema,
  updateQuestionAttachmentResponsesSchema,
} from '@/infra/presentation/controllers/update-question-attachment/schemas/update-question-attachment.protocol'
import { makeUpdateQuestionAttachmentController } from '@/main/factories/update-question-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateQuestionAttachmentRoute (app: FastifyInstance, tags: string[]) {
  app.patch(
    '/attachments/:attachmentId',
    {
      schema: {
        tags,
        description: 'Update a question attachment',
        params: updateQuestionAttachmentParamsSchema,
        body: updateQuestionAttachmentBodySchema,
        response: updateQuestionAttachmentResponsesSchema,
      },
    },
    adaptRoute(makeUpdateQuestionAttachmentController())
  )
}
