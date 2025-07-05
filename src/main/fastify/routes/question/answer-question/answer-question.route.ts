import type { FastifyInstance } from 'fastify'

import { makeAnswerQuestionController } from '@/main/factories/controllers/answer-question'
import { adaptRoute } from '@/util/adapt-route'
import {
  answerQuestionBodySchema,
  answerQuestionParamsSchema,
} from '@/external/zod/application/schemas/question/answer-question.schema'
import { answerQuestionResponsesSchema } from '@/external/zod/application/schemas/question/answer-question-responses.schema'
import { createRouteOptions } from '../../route-options'

export async function answerQuestionRoute(
  app: FastifyInstance,
  tags: string[],
) {
  app.post(
    '/:questionId/answer',
    createRouteOptions({
      tags,
      schema: {
        body: answerQuestionBodySchema,
        params: answerQuestionParamsSchema,
        response: answerQuestionResponsesSchema,
      },
    }),
    adaptRoute(makeAnswerQuestionController()),
  )
}
