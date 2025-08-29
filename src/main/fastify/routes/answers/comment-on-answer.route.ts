import type { FastifyInstance } from 'fastify'
import {
  commentOnAnswerBodySchema,
  commentOnAnswerResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/comments/comment-on-answer.schemas'
import { makeCommentOnAnswerController } from '@/main/factories/comment-on-answer'
import { adaptRoute } from '@/util/adapt-route'

export async function commentOnAnswerRoute (app: FastifyInstance, tags: string[]) {
  app.post('/:answerId/comments', {
    schema: {
      tags,
      description: 'Comment on an answer',
      body: commentOnAnswerBodySchema,
      response: commentOnAnswerResponsesSchema
    },
  },
  adaptRoute(makeCommentOnAnswerController())
  )
}
