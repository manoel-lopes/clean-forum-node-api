import type { FastifyInstance } from 'fastify'
import {
  updateAnswerBodySchema,
  updateAnswerParamsSchema,
  updateAnswerResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/answers/update-answer.schemas'
import { makeUpdateAnswerController } from '@/main/factories/update-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.patch('/:answerId', {
    schema: {
      tags,
      description: 'Update an answer',
      params: updateAnswerParamsSchema,
      body: updateAnswerBodySchema,
      response: updateAnswerResponsesSchema
    }
  }, adaptRoute(makeUpdateAnswerController()))
}
