import type { FastifyInstance } from 'fastify'
import {
  fetchQuestionCommentsParamsSchema,
  fetchQuestionCommentsQuerySchema,
  fetchQuestionCommentsResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/comments/fetch-question-comments.schemas'
import { makeFetchQuestionCommentsController } from '@/main/factories/fetch-question-comments'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function fetchQuestionCommentsRoute(app: FastifyInstance, tags: string[]) {
  app.get(
    '/:questionId/comments',
    {
      schema: {
        tags,
        description: 'Fetch comments for a question',
        params: fetchQuestionCommentsParamsSchema,
        querystring: fetchQuestionCommentsQuerySchema,
        response: fetchQuestionCommentsResponsesSchema,
      },
    },
    adaptRoute(makeFetchQuestionCommentsController()),
  )
}
