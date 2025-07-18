import type { FastifyInstance } from 'fastify'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { fetchQuestionsResponsesSchemas } from '@/infra/validation/zod/schemas/presentation/questions/fetch-questions.schemas'
import { makeFetchQuestionsController } from '@/main/factories/fetch-questions'
import { adaptRoute } from '@/util/adapt-route'

export async function fetchQuestionsRoute (app: FastifyInstance, tags: string[]) {
  app.get('/', {
    schema: {
      tags,
      description: 'Fetch a list of questions',
      querystring: paginationParamsSchema,
      response: fetchQuestionsResponsesSchemas
    }
  },
  adaptRoute(makeFetchQuestionsController())
  )
}
