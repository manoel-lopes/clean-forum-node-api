import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { fetchQuestionCommentsRoute } from './comments/fetch-question-comments.route'
import { chooseQuestionBestAnswerRoute } from './questions/choose-question-best-answer.route'
import { commentOnQuestionRoute } from './questions/comment-on-question.route'
import { createQuestionRoute } from './questions/create-question.route'
import { deleteQuestionRoute } from './questions/delete-question.route'
import { fetchQuestionsRoute } from './questions/fetch-questions.route'
import { getQuestionBySlugRoute } from './questions/get-question-by-slug.route'

export async function questionsRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createQuestionRoute,
    deleteQuestionRoute,
    getQuestionBySlugRoute,
    chooseQuestionBestAnswerRoute,
    fetchQuestionsRoute,
    commentOnQuestionRoute,
    fetchQuestionCommentsRoute
  ], {
    preHandler: [ensureAuthenticated]
  })
}
