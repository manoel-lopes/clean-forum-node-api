import type { FastifyInstance } from 'fastify'
import {
  deleteAnswerBodySchema,
  deleteAnswerParamsSchema,
  deleteAnswerResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/answers/delete-answer.schemas'
import { makeDeleteAnswerController } from '@/main/factories/delete-answer'
import { adaptRoute } from '@/util/adapt-route'

export async function deleteAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.delete('/:answerId', {
    schema: {
      tags,
      description: 'Delete a answer',
      params: deleteAnswerParamsSchema,
      body: deleteAnswerBodySchema,
      response: deleteAnswerResponsesSchema
    }
  },
  adaptRoute(makeDeleteAnswerController())
  )
}
