import type { FastifyInstance } from 'fastify'

import { createQuestionRoute } from './create-question/create-question.route'
import { answerQuestionRoute } from './answer-question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './choose-question-best-answer/choose-question-best-answer.route'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'

export async function questionRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createQuestionRoute,
    answerQuestionRoute,
    chooseQuestionBestAnswerRoute
  ])
}
