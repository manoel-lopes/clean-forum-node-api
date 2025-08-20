import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { answerQuestionRoute } from './answer-question/answer-question.route'
import { deleteAnswerRoute } from './delete-answer/delete-answer.route'

export async function answersRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    answerQuestionRoute,
    deleteAnswerRoute,
  ], {
    preHandler: [ensureAuthenticated]
  })
}
