import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { answerQuestionRoute } from './answers/answer-question.route'
import { commentOnAnswerRoute } from './answers/comment-on-answer.route'
import { deleteAnswerRoute } from './answers/delete-answer.route'
import { fetchAnswerCommentsRoute } from './comments/fetch-answer-comments.route'

export async function answersRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    answerQuestionRoute,
    deleteAnswerRoute,
    commentOnAnswerRoute,
    fetchAnswerCommentsRoute
  ], {
    preHandler: [ensureAuthenticated]
  })
}
