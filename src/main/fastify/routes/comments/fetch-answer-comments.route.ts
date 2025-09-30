import type { FastifyInstance } from 'fastify'
import {
  fetchAnswerCommentsParamsSchema,
  fetchAnswerCommentsQuerySchema,
  fetchAnswerCommentsResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/comments/fetch-answer-comments.schemas'
import { makeFetchAnswerCommentsController } from '@/main/factories/fetch-answer-comments'
import { adaptRoute } from '@/util/http/adapt-route'

export async function fetchAnswerCommentsRoute (app: FastifyInstance, tags: string[]) {
  app.get('/:answerId/comments', {
    schema: {
      tags,
      description: 'Fetch comments for an answer',
      params: fetchAnswerCommentsParamsSchema,
      querystring: fetchAnswerCommentsQuerySchema,
      response: fetchAnswerCommentsResponsesSchema
    },
  },
  adaptRoute(makeFetchAnswerCommentsController())
  )
}
