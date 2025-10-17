import type { FastifyInstance } from 'fastify'
import {
  updateQuestionCommentBodySchema,
  updateQuestionCommentParamsSchema,
  updateQuestionCommentResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/comments/update-question-comment.schemas'
import { makeUpdateQuestionCommentController } from '@/main/factories/update-question-comment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateQuestionCommentRoute(app: FastifyInstance, tags: string[]) {
  app.put(
    '/question-comments/:commentId',
    {
      schema: {
        tags,
        description: 'Update a question comment',
        params: updateQuestionCommentParamsSchema,
        body: updateQuestionCommentBodySchema,
        response: updateQuestionCommentResponsesSchema,
      },
    },
    adaptRoute(makeUpdateQuestionCommentController()),
  )
}
