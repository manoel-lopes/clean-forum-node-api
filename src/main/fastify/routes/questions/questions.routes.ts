import type { FastifyInstance } from 'fastify'

import { registerRoutes } from '@/main/fastify/helpers/register-routes'

import { answerQuestionRoute } from './answer-question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './choose-question-best-answer/choose-question-best-answer.route'
import { createQuestionRoute } from './create-question/create-question.route'
import { deleteAnswerRoute } from './delete-answer/delete-answer.route'
import { deleteQuestionRoute } from './delete-question/delete-question.route'

export async function questionsRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createQuestionRoute,
    answerQuestionRoute,
    chooseQuestionBestAnswerRoute,
    deleteQuestionRoute,
    deleteAnswerRoute,
  ])
}
