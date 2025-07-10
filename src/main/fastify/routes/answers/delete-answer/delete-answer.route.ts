import type { FastifyInstance } from 'fastify'

import { deleteAnswerParamsSchema, deleteAnswerResponsesSchema } from '@/infra/validation/zod/schemas/presentation/answers/delete-answer.schemas'

import { makeDeleteAnswerController } from '@/main/factories/delete-answer'

import { adaptRoute } from '@/util/adapt-route'

export async function deleteAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/answer/:answerId', {
    schema: {
      tags,
      description: 'Delete an answer',
      params: deleteAnswerParamsSchema,
      response: deleteAnswerResponsesSchema
    }
  },
  adaptRoute(makeDeleteAnswerController())
  )
}
