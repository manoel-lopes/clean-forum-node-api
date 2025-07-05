import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { makeAnswerQuestionController } from '@/main/factories/controllers/answer-question'
import { adaptRoute } from '@/util/adapt-route'
import {
  answerQuestionBodySchema,
  answerQuestionParamsSchema,
} from '@/external/zod/application/schemas/question/answer-question.schema'
import {
  answerQuestionResponsesSchema
} from '@/external/zod/application/schemas/question/answer-question-responses.schema'

export function answerQuestionRoute (app: HttpServer) {
  app.post(
    '/question/:questionId/answer',
    {
      schema: {
        tags: ['Question'],
        request: {
          body: answerQuestionBodySchema,
          params: answerQuestionParamsSchema,
        },
        response: answerQuestionResponsesSchema,
      },
    },
    adaptRoute(makeAnswerQuestionController())
  )
}
