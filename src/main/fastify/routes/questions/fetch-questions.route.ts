import type { FastifyInstance } from 'fastify'
import {
  fetchQuestionsResponsesSchemas,
  paginationWithIncludeParamsSchema,
} from '@/infra/presentation/controllers/fetch-questions/schemas/fetch-questions.protocol'
import { makeFetchQuestionsController } from '@/main/factories/fetch-questions'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function fetchQuestionsRoute (app: FastifyInstance, tags: string[]) {
  app.get(
    '/',
    {
      schema: {
        tags,
        description: 'Fetch a list of questions with optional includes (comments, attachments, author)',
        querystring: paginationWithIncludeParamsSchema,
        response: fetchQuestionsResponsesSchemas,
      },
      config: {
        rateLimit: readOperationsRateLimit(),
      },
    },
    adaptRoute(makeFetchQuestionsController())
  )
}
