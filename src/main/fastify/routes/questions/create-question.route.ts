import type { FastifyInstance } from 'fastify'
import {
  createQuestionBodySchema,
  createQuestionResponsesSchema,
} from '@/infra/presentation/controllers/create-question/schemas/create-question.protocol'
import { makeCreateQuestionController } from '@/main/factories/create-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function createQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/',
    {
      schema: {
        tags,
        description: 'Create a new question',
        body: createQuestionBodySchema,
        response: createQuestionResponsesSchema,
      },
    },
    adaptRoute(makeCreateQuestionController())
  )
}
