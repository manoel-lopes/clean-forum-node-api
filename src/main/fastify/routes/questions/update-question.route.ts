import type { FastifyInstance } from 'fastify'
import {
  updateQuestionBodySchema,
  updateQuestionParamsSchema,
  updateQuestionResponsesSchema,
} from '@/infra/presentation/controllers/update-question/schemas/update-question.protocol'
import { makeUpdateQuestionController } from '@/main/factories/update-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.patch(
    '/:questionId',
    {
      schema: {
        tags,
        description: 'Update a question',
        params: updateQuestionParamsSchema,
        body: updateQuestionBodySchema,
        response: updateQuestionResponsesSchema,
      },
    },
    adaptRoute(makeUpdateQuestionController())
  )
}
