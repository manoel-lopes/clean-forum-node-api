import type { FastifyInstance } from 'fastify'

import {
  answerQuestionBodySchema,
  answerQuestionResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/answers/answer-question.schemas'

import { makeAnswerQuestionController } from '@/main/factories/answer-question'

import { adaptRoute } from '@/util/adapt-route'

export async function answerQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post('', {
    schema: {
      tags,
      description: 'Answer a question',
      body: answerQuestionBodySchema,
      response: answerQuestionResponsesSchema
    }
  },
  adaptRoute(makeAnswerQuestionController())
  )
}
