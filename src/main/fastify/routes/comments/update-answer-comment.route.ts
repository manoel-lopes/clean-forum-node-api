import type { FastifyInstance } from 'fastify'
import {
  updateAnswerCommentBodySchema,
  updateAnswerCommentParamsSchema,
  updateAnswerCommentResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/comments/update-answer-comment.schemas'
import { makeUpdateAnswerCommentController } from '@/main/factories/update-answer-comment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateAnswerCommentRoute (app: FastifyInstance, tags: string[]) {
  app.put(
    '/answer-comments/:commentId',
    {
      schema: {
        tags,
        description: 'Update an answer comment',
        params: updateAnswerCommentParamsSchema,
        body: updateAnswerCommentBodySchema,
        response: updateAnswerCommentResponsesSchema,
      },
    },
    adaptRoute(makeUpdateAnswerCommentController())
  )
}
