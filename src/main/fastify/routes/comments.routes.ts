import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '@/main/fastify/middlewares/ensure-authenticated'
import { deleteAnswerCommentRoute } from './comments/delete-answer-comment.route'
import { deleteQuestionCommentRoute } from './comments/delete-question-comment.route'
import { updateAnswerCommentRoute } from './comments/update-answer-comment.route'
import { updateQuestionCommentRoute } from './comments/update-question-comment.route'

export async function commentsRoutes (app: FastifyInstance) {
  registerRoutes(
    app,
    [updateAnswerCommentRoute, updateQuestionCommentRoute, deleteAnswerCommentRoute, deleteQuestionCommentRoute],
    {
      preHandler: [ensureAuthenticated],
    }
  )
}
