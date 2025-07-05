import { answerQuestionRoute } from './answer-question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './choose-question-best-answer/choose-question-best-answer.route'
import { createQuestionRoute } from './create-question/create-question.route'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import type { FastifyInstance } from 'fastify'

export async function questionsRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createQuestionRoute,
    answerQuestionRoute,
    chooseQuestionBestAnswerRoute
  ])
}
