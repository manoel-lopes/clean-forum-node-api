import type { FastifyInstance } from 'fastify'
import {
  fetchAnswerAttachmentsParamsSchema,
  fetchAnswerAttachmentsQuerySchema,
  fetchAnswerAttachmentsResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/attachments/fetch-answer-attachments.schemas'
import { makeFetchAnswerAttachmentsController } from '@/main/factories/fetch-answer-attachments'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function fetchAnswerAttachmentsRoute (app: FastifyInstance, tags: string[]) {
  app.get('/:answerId/attachments', {
    schema: {
      tags,
      description: 'Fetch attachments for an answer',
      params: fetchAnswerAttachmentsParamsSchema,
      querystring: fetchAnswerAttachmentsQuerySchema,
      response: fetchAnswerAttachmentsResponsesSchema
    }
  },
  adaptRoute(makeFetchAnswerAttachmentsController())
  )
}
