import type { FastifyInstance } from 'fastify'

import { makeChooseQuestionBestAnswerController } from '@/main/factories/choose-question-best-answer'
import {
  chooseQuestionBestAnswerBodySchema,
  chooseQuestionBestAnswerParamsSchema
} from '@/main/zod/schemas/presentation/questions/choose-question-best-answer.schema'
import { chooseQuestionBestAnswerResponsesSchema } from '@/main/zod/schemas/presentation/questions/choose-question-best-answer-responses.schema'

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
