import type { FastifyInstance } from 'fastify'
import {
  commentOnQuestionBodySchema,
  commentOnQuestionResponsesSchema,
} from '@/infra/presentation/controllers/comment-on-question/schemas/comment-on-question.protocol'
import { makeCommentOnQuestionController } from '@/main/factories/comment-on-question'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function commentOnQuestionRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/:questionId/comments',
    {
      schema: {
        tags,
        description: 'Comment on a question',
        body: commentOnQuestionBodySchema,
        response: commentOnQuestionResponsesSchema,
      },
    },
    adaptRoute(makeCommentOnQuestionController())
  )
}
