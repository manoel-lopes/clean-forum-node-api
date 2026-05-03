import type { FastifyInstance } from 'fastify'
import {
  deleteAnswerCommentParamsSchema,
  deleteAnswerCommentResponsesSchema,
} from '@/infra/presentation/controllers/delete-comment/schemas/delete-comment.protocol'
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
