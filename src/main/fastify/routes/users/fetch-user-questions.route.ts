import type { FastifyInstance } from 'fastify'
import {
  fetchUserQuestionsParamsSchema,
  fetchUserQuestionsQuerySchema,
  fetchUserQuestionsResponsesSchema,
} from '@/infra/presentation/controllers/fetch-user-questions/schemas/fetch-user-questions.protocol'
import { makeFetchUserQuestionsController } from '@/main/factories/fetch-user-questions'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function fetchUserQuestionsRoute (app: FastifyInstance, tags: string[]) {
  app.get(
    '/:userId/questions',
    {
      schema: {
        tags,
        description: 'Fetch all questions from a specific user',
        params: fetchUserQuestionsParamsSchema,
        querystring: fetchUserQuestionsQuerySchema,
        response: fetchUserQuestionsResponsesSchema,
      },
      config: {
        rateLimit: readOperationsRateLimit(),
      },
    },
    adaptRoute(makeFetchUserQuestionsController())
  )
}
