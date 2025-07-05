import type { FastifyInstance } from 'fastify'

import { makeChooseQuestionBestAnswerController } from '@/main/factories/controllers/choose-question-best-answer'
import { adaptRoute } from '@/util/adapt-route'
import {
  chooseQuestionBestAnswerBodySchema,
  chooseQuestionBestAnswerParamsSchema
} from '@/external/zod/application/schemas/question/choose-question-best-answer.schema'
import { chooseQuestionBestAnswerResponsesSchema } from '@/external/zod/application/schemas/question/choose-question-best-answer-responses.schema'
import { createRouteOptions } from '../../route-options'

export async function chooseQuestionBestAnswerRoute(app: FastifyInstance, tags: string[]) {
  app.patch(
    '/answers/:answerId/choose-as-best',
    createRouteOptions({
      tags,
      schema: {
        body: chooseQuestionBestAnswerBodySchema,
        params: chooseQuestionBestAnswerParamsSchema,
        response: chooseQuestionBestAnswerResponsesSchema
      }
    }),
    adaptRoute(makeChooseQuestionBestAnswerController())
  )
}
