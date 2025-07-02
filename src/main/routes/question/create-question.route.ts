import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { makeCreateQuestionController } from '@/main/factories/controllers/create-question'
import { adaptRoute } from '@/util/adapt-route'
import {
  createQuestionSchema
} from '@/external/zod/application/schemas/question/create-question.schema'
import {
  createQuestionResponsesSchema
} from '@/external/zod/application/schemas/question/create-question-responses.schema'

export function createQuestionRoute (app: HttpServer) {
  app.post(
    '/question',
    {
      schema: {
        request: {
          body: createQuestionSchema,
        },
        response: createQuestionResponsesSchema,
      },
    },
    adaptRoute(makeCreateQuestionController())
  )
}
