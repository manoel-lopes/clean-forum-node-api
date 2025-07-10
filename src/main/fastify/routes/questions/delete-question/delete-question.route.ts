import type { FastifyInstance } from 'fastify'

import {
  deleteQuestionBodySchema,
  deleteQuestionParamsSchema,
  deleteQuestionResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/questions/delete-question.schemas'

import { makeDeleteQuestionController } from '@/main/factories/delete-question'

import { adaptRoute } from '@/util/adapt-route'

export async function deleteQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/:questionId', {
    schema: {
      tags,
      description: 'Delete a question',
      params: deleteQuestionParamsSchema,
      body: deleteQuestionBodySchema,
      response: deleteQuestionResponsesSchema
    }
  },
  adaptRoute(makeDeleteQuestionController())
  )
}
