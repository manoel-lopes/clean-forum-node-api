import type { FastifyInstance } from 'fastify'

import { createQuestionSchema } from '@/external/zod/application/schemas/question/create-question.schema'
import { createQuestionResponsesSchema } from '@/external/zod/application/schemas/question/create-question-responses.schema'

import { makeCreateQuestionController } from '@/main/factories/controllers/create-question'

import { adaptRoute } from '@/util/adapt-route'

export async function createQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Create a new question',
      body: createQuestionSchema,
      response: createQuestionResponsesSchema
    }
  },
  adaptRoute(makeCreateQuestionController())
  )
}
