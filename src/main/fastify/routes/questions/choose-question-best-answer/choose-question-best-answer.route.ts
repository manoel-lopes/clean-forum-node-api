import type { FastifyInstance } from 'fastify'

import {
  chooseQuestionBestAnswerBodySchema,
  chooseQuestionBestAnswerParamsSchema
} from '@/external/zod/application/schemas/question/choose-question-best-answer.schema'
import { chooseQuestionBestAnswerResponsesSchema } from '@/external/zod/application/schemas/question/choose-question-best-answer-responses.schema'

import { makeChooseQuestionBestAnswerController } from '@/main/factories/controllers/choose-question-best-answer'

import { adaptRoute } from '@/util/adapt-route'

export async function chooseQuestionBestAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.patch('/answers/:answerId/choose-as-best', {
    schema: {
      tags,
      description: 'Choose the best answer for an question',
      body: chooseQuestionBestAnswerBodySchema,
      params: chooseQuestionBestAnswerParamsSchema,
      response: chooseQuestionBestAnswerResponsesSchema
    }
  },
  adaptRoute(makeChooseQuestionBestAnswerController())
  )
}
