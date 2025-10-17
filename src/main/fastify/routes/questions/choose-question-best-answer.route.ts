import type { FastifyInstance } from 'fastify'
import {
  chooseQuestionBestAnswerParamsSchema,
  chooseQuestionBestAnswerResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/questions/choose-question-best-answer.schemas'
import { makeChooseQuestionBestAnswerController } from '@/main/factories/choose-question-best-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function chooseQuestionBestAnswerRoute(app: FastifyInstance, tags: string[]) {
  app.patch(
    '/:answerId/choose',
    {
      schema: {
        tags,
        description: 'Choose the best answer for an question',
        params: chooseQuestionBestAnswerParamsSchema,
        response: chooseQuestionBestAnswerResponsesSchema,
      },
    },
    adaptRoute(makeChooseQuestionBestAnswerController()),
  )
}
