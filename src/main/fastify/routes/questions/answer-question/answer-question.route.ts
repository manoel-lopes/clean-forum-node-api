import type { FastifyInstance } from 'fastify'

import { makeAnswerQuestionController } from '@/main/factories/answer-question'
import {
  answerQuestionBodySchema,
  answerQuestionParamsSchema
} from '@/main/zod/schemas/presentation/questions/answer-question.schema'
import { answerQuestionResponsesSchema } from '@/main/zod/schemas/presentation/questions/answer-question-responses.schema'

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
