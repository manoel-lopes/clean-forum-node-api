import type { FastifyInstance } from 'fastify'
import {
  getQuestionBySlugParamsSchema,
  getQuestionBySlugQuerySchema,
  getQuestionBySlugResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/questions/get-question-by-slug.schemas'
import { makeGetQuestionBySlugController } from '@/main/factories/get-question-by-slug'
import { adaptRoute } from '@/shared/util/http/adapt-route'
import { readOperationsRateLimit } from '../../plugins/rate-limit'

export async function getQuestionBySlugRoute (app: FastifyInstance, tags: string[]) {
  app.get(
    '/:slug',
    {
      schema: {
        tags,
        description:
          'Get a question by slug with optional includes for related data. ' +
          'Use the include parameter to fetch question-level comments, attachments, and author. ' +
          'Use the answerIncludes parameter to fetch answer-level comments, attachments, and author for each answer. ' +
          'Supported values for both: comments, attachments, author (can be combined with commas).',
        params: getQuestionBySlugParamsSchema,
        querystring: getQuestionBySlugQuerySchema,
        response: getQuestionBySlugResponsesSchema,
      },
      config: {
        rateLimit: readOperationsRateLimit(),
      },
    },
    adaptRoute(makeGetQuestionBySlugController())
  )
}
