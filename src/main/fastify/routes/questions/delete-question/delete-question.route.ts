import type { FastifyInstance } from 'fastify'

import { deleteQuestionSchema } from '@/infra/validation/zod/schemas/presentation/questions/delete-question.schema'
import { deleteQuestionResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/delete-question-responses.schema'

import { makeDeleteQuestionController } from '@/main/factories/delete-question'

import { adaptRoute } from '@/util/adapt-route'

export async function deleteQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/:questionId', {
    schema: {
      tags,
      description: 'Delete a question',
      params: deleteQuestionSchema,
      response: deleteQuestionResponsesSchema
    }
  },
  adaptRoute(makeDeleteQuestionController())
  )
}
