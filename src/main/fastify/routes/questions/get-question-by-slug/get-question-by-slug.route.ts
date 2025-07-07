import type { FastifyInstance } from 'fastify'

import { getQuestionBySlugSchema } from '@/infra/validation/zod/schemas/presentation/questions/get-question-by-slug.schema'
import { getQuestionBySlugResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/get-question-by-slug-responses.schema'

import { makeGetQuestionBySlugController } from '@/main/factories/get-question-by-slug'

import { adaptRoute } from '@/util/adapt-route'

export async function getQuestionBySlugRoute (app: FastifyInstance, tags: string[]) {
  app.get('/questions/:slug', {
    schema: {
      tags,
      description: 'Get a question by slug',
      params: getQuestionBySlugSchema,
      response: getQuestionBySlugResponsesSchema
    }
  },
  adaptRoute(makeGetQuestionBySlugController())
  )
}
