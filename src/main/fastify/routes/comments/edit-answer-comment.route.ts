import type { FastifyInstance } from 'fastify'
import {
  editAnswerCommentBodySchema,
  editAnswerCommentParamsSchema,
  editAnswerCommentResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/comments/edit-answer-comment.schemas'
import { makeEditAnswerCommentController } from '@/main/factories/edit-answer-comment'
import { adaptRoute } from '@/util/adapt-route'

export async function editAnswerCommentRoute (app: FastifyInstance, tags: string[]) {
  app.put('/answer-comments/:commentId', {
    schema: {
      tags,
      description: 'Edit an answer comment',
      params: editAnswerCommentParamsSchema,
      body: editAnswerCommentBodySchema,
      response: editAnswerCommentResponsesSchema
    },
  },
  adaptRoute(makeEditAnswerCommentController())
  )
}
