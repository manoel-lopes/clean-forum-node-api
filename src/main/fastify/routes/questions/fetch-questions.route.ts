import type { FastifyInstance } from 'fastify'
import { fetchQuestionsResponsesSchemas } from '@/infra/validation/zod/schemas/presentation/questions/fetch-questions.schemas'
import { paginationWithIncludeParamsSchema } from '@/infra/validation/zod/schemas/presentation/questions/questions-include-params.schema'
import { makeFetchQuestionsController } from '@/main/factories/fetch-questions'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function fetchQuestionsRoute (app: FastifyInstance, tags: string[]) {
  app.get('/', {
    schema: {
      tags,
      description: 'Fetch a list of questions with optional includes (comments, attachments, author)',
      querystring: paginationWithIncludeParamsSchema,
      response: fetchQuestionsResponsesSchemas
    },
    config: {
      rateLimit: readOperationsRateLimit()
    }
  },
  adaptRoute(makeFetchQuestionsController())
  )
}
