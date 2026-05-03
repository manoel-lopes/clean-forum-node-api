import type { FastifyInstance } from 'fastify'
import {
  fetchQuestionAnswersParamsSchema,
  fetchQuestionAnswersQuerySchema,
} from '@/infra/presentation/controllers/fetch-question-answers/schemas/fetch-question-answers.protocol'
import { makeFetchQuestionAnswersController } from '@/main/factories/fetch-question-answers'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function fetchQuestionAnswersRoute (app: FastifyInstance) {
  app.get(
    '/:questionId/answers',
    {
      schema: {
        params: fetchQuestionAnswersParamsSchema,
        querystring: fetchQuestionAnswersQuerySchema,
      },
    },
    adaptRoute(makeFetchQuestionAnswersController())
  )
}
