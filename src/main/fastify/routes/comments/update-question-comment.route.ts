import type { FastifyInstance } from 'fastify'
import {
  updateQuestionCommentBodySchema,
  updateQuestionCommentParamsSchema,
  updateQuestionCommentResponsesSchema,
} from '@/infra/presentation/controllers/update-comment/schemas/update-comment.protocol'
import { makeUpdateQuestionCommentController } from '@/main/factories/update-question-comment'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function updateQuestionCommentRoute (app: FastifyInstance, tags: string[]) {
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
    adaptRoute(makeUpdateQuestionCommentController())
  )
}
