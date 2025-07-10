import type { FastifyInstance } from 'fastify'

import { chooseQuestionBestAnswerBodySchema, chooseQuestionBestAnswerParamsSchema, chooseQuestionBestAnswerResponsesSchema } from '@/infra/validation/zod/schemas/presentation/questions/choose-question-best-answer.schemas'

import { makeChooseQuestionBestAnswerController } from '@/main/factories/choose-question-best-answer'

import { adaptRoute } from '@/util/adapt-route'

export async function chooseQuestionBestAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.patch('/questions/:questionId/answers/:answerId/choose-as-best', {
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
