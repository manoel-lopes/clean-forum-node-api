import type { FastifyInstance } from 'fastify'

import { makeCreateQuestionController } from '@/main/factories/controllers/create-question'
import { adaptRoute } from '@/util/adapt-route'
import { createQuestionSchema } from '@/external/zod/application/schemas/question/create-question.schema'
import { createQuestionResponsesSchema } from '@/external/zod/application/schemas/question/create-question-responses.schema'

export async function createQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '',
    {
      schema: {
        tags,
        body: createQuestionSchema,
        response: createQuestionResponsesSchema
      }
    },
    adaptRoute(makeCreateQuestionController())
  )
}
