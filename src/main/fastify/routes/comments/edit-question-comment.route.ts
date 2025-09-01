import type { FastifyInstance } from 'fastify'
import {
  editQuestionCommentBodySchema,
  editQuestionCommentParamsSchema,
  editQuestionCommentResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/comments/edit-question-comment.schemas'
import { makeEditQuestionCommentController } from '@/main/factories/edit-question-comment'
import { adaptRoute } from '@/util/adapt-route'

export async function editQuestionCommentRoute (app: FastifyInstance, tags: string[]) {
  app.put('/question-comments/:commentId', {
    schema: {
      tags,
      description: 'Edit a question comment',
      params: editQuestionCommentParamsSchema,
      body: editQuestionCommentBodySchema,
      response: editQuestionCommentResponsesSchema
    },
  },
  adaptRoute(makeEditQuestionCommentController())
  )
}
