import type { FastifyInstance } from 'fastify'

import {
  chooseQuestionBestAnswerBodySchema,
  chooseQuestionBestAnswerParamsSchema
} from '@/infra/validation/zod/schemas/presentation/questions/choose-question-best-answer.schema'
import { chooseQuestionBestAnswerResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/choose-question-best-answer-responses.schema'

import { makeChooseQuestionBestAnswerController } from '@/main/factories/choose-question-best-answer'

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
