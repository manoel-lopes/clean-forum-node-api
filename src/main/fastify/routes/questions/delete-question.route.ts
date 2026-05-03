import type { FastifyInstance } from 'fastify'
import {
  deleteQuestionParamsSchema,
  deleteQuestionResponsesSchema,
} from '@/infra/presentation/controllers/delete-question/schemas/delete-question.protocol'
import { makeDeleteQuestionController } from '@/main/factories/delete-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/:questionId',
    {
      schema: {
        tags,
        description: 'Delete a question',
        params: deleteQuestionParamsSchema,
        response: deleteQuestionResponsesSchema,
      },
    },
    adaptRoute(makeDeleteQuestionController())
  )
}
