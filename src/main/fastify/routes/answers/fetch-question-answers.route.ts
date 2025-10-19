import type { FastifyInstance } from 'fastify'
import {
  fetchQuestionAnswersParamsSchema,
  fetchQuestionAnswersQuerySchema,
} from '@/infra/validation/zod/schemas/presentation/answers/fetch-question-answers.schemas'
import { makeFetchQuestionAnswersController } from '@/main/factories/fetch-question-answers'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function fetchQuestionAnswersRoute (app: FastifyInstance): Promise<void> {
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
