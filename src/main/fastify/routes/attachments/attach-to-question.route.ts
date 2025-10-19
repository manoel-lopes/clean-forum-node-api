import type { FastifyInstance } from 'fastify'
import {
  attachToQuestionBodySchema,
  attachToQuestionParamsSchema,
  attachToQuestionResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/attachments/attach-to-question.schemas'
import { makeAttachToQuestionController } from '@/main/factories/attach-to-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function attachToQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/:questionId/attachments',
    {
      schema: {
        tags,
        description: 'Attach a file to a question',
        params: attachToQuestionParamsSchema,
        body: attachToQuestionBodySchema,
        response: attachToQuestionResponsesSchema,
      },
    },
    adaptRoute(makeAttachToQuestionController())
  )
}
