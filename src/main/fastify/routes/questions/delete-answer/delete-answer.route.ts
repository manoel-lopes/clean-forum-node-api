import type { FastifyInstance } from 'fastify'

import { deleteAnswerSchema } from '@/infra/validation/zod/schemas/presentation/questions/delete-answer.schema'
import { deleteAnswerResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/delete-answer-responses.schema'

import { makeDeleteAnswerController } from '@/main/factories/delete-answer'

import { adaptRoute } from '@/util/adapt-route'

export async function deleteAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/:answerId', {
    schema: {
      tags,
      description: 'Delete an answer',
      params: deleteAnswerSchema,
      response: deleteAnswerResponsesSchema
    }
  },
  adaptRoute(makeDeleteAnswerController())
  )
}
