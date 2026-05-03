import type { FastifyInstance } from 'fastify'
import {
  deleteAnswerParamsSchema,
  deleteAnswerResponsesSchema,
} from '@/infra/presentation/controllers/delete-answer/schemas/delete-answer.protocol'
import { makeDeleteAnswerController } from '@/main/factories/delete-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/:answerId',
    {
      schema: {
        tags,
        description: 'Delete a answer',
        params: deleteAnswerParamsSchema,
        response: deleteAnswerResponsesSchema,
      },
    },
    adaptRoute(makeDeleteAnswerController())
  )
}
