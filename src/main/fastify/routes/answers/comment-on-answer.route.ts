import type { FastifyInstance } from 'fastify'
import {
  commentOnAnswerBodySchema,
  commentOnAnswerResponsesSchema,
} from '@/infra/presentation/controllers/comment-on-answer/schemas/comment-on-answer.protocol'
import { makeCommentOnAnswerController } from '@/main/factories/comment-on-answer'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function commentOnAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.post(
    '/:answerId/comments',
    {
      schema: {
        tags,
        description: 'Comment on an answer',
        body: commentOnAnswerBodySchema,
        response: commentOnAnswerResponsesSchema,
      },
    },
    adaptRoute(makeCommentOnAnswerController())
  )
}
