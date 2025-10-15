import type { FastifyInstance } from 'fastify'
import {
  fetchQuestionAttachmentsParamsSchema,
  fetchQuestionAttachmentsQuerySchema,
  fetchQuestionAttachmentsResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/attachments/fetch-question-attachments.schemas'
import { makeFetchQuestionAttachmentsController } from '@/main/factories/fetch-question-attachments'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function fetchQuestionAttachmentsRoute (app: FastifyInstance, tags: string[]) {
  app.get('/:questionId/attachments', {
    schema: {
      tags,
      description: 'Fetch attachments for a question',
      params: fetchQuestionAttachmentsParamsSchema,
      querystring: fetchQuestionAttachmentsQuerySchema,
      response: fetchQuestionAttachmentsResponsesSchema
    }
  },
  adaptRoute(makeFetchQuestionAttachmentsController())
  )
}
