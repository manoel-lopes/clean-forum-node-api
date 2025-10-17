import type { FastifyInstance } from 'fastify'
import {
  getQuestionBySlugParamsSchema,
  getQuestionBySlugResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/questions/get-question-by-slug.schemas'
import { makeGetQuestionBySlugController } from '@/main/factories/get-question-by-slug'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function getQuestionBySlugRoute(app: FastifyInstance, tags: string[]) {
  app.get(
    '/:slug',
    {
      schema: {
        tags,
        description: 'Get a question by slug',
        params: getQuestionBySlugParamsSchema,
        response: getQuestionBySlugResponsesSchema,
      },
      config: {
        rateLimit: readOperationsRateLimit(),
      },
    },
    adaptRoute(makeGetQuestionBySlugController()),
  )
}
