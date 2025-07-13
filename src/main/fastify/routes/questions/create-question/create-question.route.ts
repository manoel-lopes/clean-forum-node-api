import type { FastifyInstance } from 'fastify'
import {
  createQuestionBodySchema,
  createQuestionResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/questions/create-question.schemas'
import { makeCreateQuestionController } from '@/main/factories/create-question'
import { adaptRoute } from '@/util/adapt-route'

export async function createQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Create a new question',
      body: createQuestionBodySchema,
      response: createQuestionResponsesSchema
    }
  },
  adaptRoute(makeCreateQuestionController())
  )
}
