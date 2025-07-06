import type { FastifyInstance } from 'fastify'

import { createQuestionSchema } from '@/infra/validation/zod/schemas/presentation/questions/create-question.schema'
import { createQuestionResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/create-question-responses.schema'

import { makeCreateQuestionController } from '@/main/factories/create-question'

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
