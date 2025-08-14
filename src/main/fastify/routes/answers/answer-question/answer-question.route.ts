import type { FastifyInstance } from 'fastify'
import {
  answerQuestionBodySchema,
  answerQuestionParamsSchema,
  answerQuestionResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/answers/answer-question.schemas'
import { makeAnswerQuestionController } from '@/main/factories/answer-question'
import { adaptRoute } from '@/util/adapt-route'

export async function answerQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post('/:questionId', {
    schema: {
      tags,
      description: 'Answer a question',
      params: answerQuestionParamsSchema,
      body: answerQuestionBodySchema,
      response: answerQuestionResponsesSchema
    },
  },
  adaptRoute(makeAnswerQuestionController())
  )
}
