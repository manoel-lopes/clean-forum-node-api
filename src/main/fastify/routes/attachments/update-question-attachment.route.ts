import type { FastifyInstance } from 'fastify'
import {
  updateQuestionAttachmentBodySchema,
  updateQuestionAttachmentParamsSchema,
  updateQuestionAttachmentResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/attachments/update-question-attachment.schemas'
import { makeUpdateQuestionAttachmentController } from '@/main/factories/update-question-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateQuestionAttachmentRoute(app: FastifyInstance, tags: string[]) {
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
    adaptRoute(makeUpdateQuestionAttachmentController()),
  )
}
