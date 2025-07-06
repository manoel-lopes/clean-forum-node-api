import type { FastifyInstance } from 'fastify'

import {
  answerQuestionBodySchema,
  answerQuestionParamsSchema
} from '@/external/zod/application/schemas/question/answer-question.schema'
import { answerQuestionResponsesSchema } from '@/external/zod/application/schemas/question/answer-question-responses.schema'

import { makeAnswerQuestionController } from '@/main/factories/controllers/answer-question'

import { adaptRoute } from '@/util/adapt-route'

export async function answerQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post('/:questionId/answer', {
    schema: {
      tags,
      description: 'Answer a question',
      body: answerQuestionBodySchema,
      params: answerQuestionParamsSchema,
      response: answerQuestionResponsesSchema
    }
  },
  adaptRoute(makeAnswerQuestionController())
  )
}
