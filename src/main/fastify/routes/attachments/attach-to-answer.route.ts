import type { FastifyInstance } from 'fastify'
import {
  attachToAnswerBodySchema,
  attachToAnswerParamsSchema,
  attachToAnswerResponsesSchema,
} from '@/infra/presentation/controllers/attach-to-answer/schemas/attach-to-answer.protocol'
import { makeAttachToAnswerController } from '@/main/factories/attach-to-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function attachToAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/:answerId/attachments',
    {
      schema: {
        tags,
        description: 'Attach a file to an answer',
        params: attachToAnswerParamsSchema,
        body: attachToAnswerBodySchema,
        response: attachToAnswerResponsesSchema,
      },
    },
    adaptRoute(makeAttachToAnswerController())
  )
}
