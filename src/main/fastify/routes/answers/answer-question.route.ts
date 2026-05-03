import type { FastifyInstance } from 'fastify'
import {
  answerQuestionBodySchema,
  answerQuestionResponsesSchema,
} from '@/infra/presentation/controllers/answer-question/schemas/answer-question.protocol'
import { makeAnswerQuestionController } from '@/main/factories/answer-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function answerQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/',
    {
      schema: {
        tags,
        description: 'Answer a question',
        body: answerQuestionBodySchema,
        response: answerQuestionResponsesSchema,
      },
    },
    adaptRoute(makeAnswerQuestionController())
  )
}
