import type { FastifyInstance } from 'fastify'

import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { fetchAnswersResponsesSchemas } from '@/infra/validation/zod/schemas/presentation/answers/fetch-answers.schemas'

import { makeFetchAnswersController } from '@/main/factories/fetch-answers'

import { adaptRoute } from '@/util/adapt-route'

export async function fetchAnswersRoute (app: FastifyInstance, tags: string[]) {
  app.get('/', {
    schema: {
      tags,
      description: 'Fetch a list of answers',
      querystring: paginationParamsSchema,
      response: fetchAnswersResponsesSchemas
    }
  },
  adaptRoute(makeFetchAnswersController())
  )
}
