import type { FastifyInstance } from 'fastify'
import {
  deleteAnswerCommentParamsSchema,
  deleteAnswerCommentResponsesSchema,
} from '@/infra/validation/zod/schemas/presentation/comments/delete-answer-comment.schemas'
import { makeDeleteAnswerCommentController } from '@/main/factories/delete-answer-comment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteAnswerCommentRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/answer-comments/:commentId',
    {
      schema: {
        tags,
        description: 'Delete an answer comment',
        params: deleteAnswerCommentParamsSchema,
        response: deleteAnswerCommentResponsesSchema,
      },
    },
    adaptRoute(makeDeleteAnswerCommentController())
  )
}
