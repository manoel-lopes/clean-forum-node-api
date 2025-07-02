import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import {
  makeChooseQuestionBestAnswerController
} from '@/main/factories/controllers/choose-question-best-answer'
import { adaptRoute } from '@/util/adapt-route'
import {
  chooseQuestionBestAnswerBodySchema,
  chooseQuestionBestAnswerParamsSchema,
} from '@/external/zod/application/schemas/question/choose-question-best-answer.schema'
import {
  chooseQuestionBestAnswerResponsesSchema
} from '@/external/zod/application/schemas/question/choose-question-best-answer-responses.schema'

export function chooseQuestionBestAnswerRoute (app: HttpServer) {
  app.patch(
    '/answer/:answerId/best',
    {
      schema: {
        request: {
          body: chooseQuestionBestAnswerBodySchema,
          params: chooseQuestionBestAnswerParamsSchema,
        },
        response: chooseQuestionBestAnswerResponsesSchema,
      },
    },
    adaptRoute(makeChooseQuestionBestAnswerController())
  )
}
