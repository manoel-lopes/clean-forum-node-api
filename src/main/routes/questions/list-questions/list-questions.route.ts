import {
  listQuestionsRequestSchema,
} from '@/external/zod/application/list-questions/list-questions-request.schema'
import {
  listQuestionsResponseSchema,
} from '@/external/zod/application/list-questions/list-questions-response.schema'
import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { makeListQuestionsController } from '@/main/factories/make-list-questions-controller'
import { adaptRoute } from '@/util/adapt-route'

export function listQuestionsRoute (app: HttpServer) {
  app.get('/questions', {
    schema: {
      tags: ['Questions'],
      description: 'List questions',
      request: listQuestionsRequestSchema.shape,
      response: listQuestionsResponseSchema,
    },
  }, adaptRoute(makeListQuestionsController()))
}
