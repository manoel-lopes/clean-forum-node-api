import type { FastifyInstance } from 'fastify'
import {
  updateAnswerBodySchema,
  updateAnswerParamsSchema,
  updateAnswerResponsesSchema,
} from '@/infra/presentation/controllers/update-answer/schemas/update-answer.protocol'
import { makeUpdateAnswerController } from '@/main/factories/update-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.patch(
    '/:answerId',
    {
      schema: {
        tags,
        description: 'Update an answer',
        params: updateAnswerParamsSchema,
        body: updateAnswerBodySchema,
        response: updateAnswerResponsesSchema,
      },
    },
    adaptRoute(makeUpdateAnswerController())
  )
}
