import type { FastifyInstance } from 'fastify'

import { makeCreateQuestionController } from '@/main/factories/create-question'
import { createQuestionSchema } from '@/main/zod/schemas/presentation/questions/create-question.schema'
import { createQuestionResponsesSchema } from '@/main/zod/schemas/presentation/questions/create-question-responses.schema'

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
