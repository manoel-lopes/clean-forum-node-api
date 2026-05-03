import type { FastifyInstance } from 'fastify'
import {
  deleteQuestionCommentParamsSchema,
  deleteQuestionCommentResponsesSchema,
} from '@/infra/presentation/controllers/delete-comment/schemas/delete-comment.protocol'
import { makeDeleteQuestionCommentController } from '@/main/factories/delete-question-comment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function deleteQuestionCommentRoute (app: FastifyInstance, tags: string[]) {
  app.delete(
    '/question-comments/:commentId',
    {
      schema: {
        tags,
        description: 'Delete a question comment',
        params: deleteQuestionCommentParamsSchema,
        response: deleteQuestionCommentResponsesSchema,
      },
    },
    adaptRoute(makeDeleteQuestionCommentController())
  )
}
