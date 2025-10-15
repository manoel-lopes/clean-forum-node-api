import type { FastifyInstance } from 'fastify'
import {
  deleteQuestionAttachmentParamsSchema,
  deleteQuestionAttachmentResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/attachments/delete-question-attachment.schemas'
import { makeDeleteQuestionAttachmentController } from '@/main/factories/delete-question-attachment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteQuestionAttachmentRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/attachments/:attachmentId', {
    schema: {
      tags,
      description: 'Delete a question attachment',
      params: deleteQuestionAttachmentParamsSchema,
      response: deleteQuestionAttachmentResponsesSchema
    }
  },
  adaptRoute(makeDeleteQuestionAttachmentController())
  )
}
