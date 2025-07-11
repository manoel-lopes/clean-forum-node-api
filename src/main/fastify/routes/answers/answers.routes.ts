import type { FastifyInstance } from 'fastify'

import { registerRoutes } from '@/main/fastify/helpers/register-routes'

import { answerQuestionRoute } from './answer-question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './choose-question-best-answer/choose-question-best-answer.route'
import { deleteAnswerRoute } from './delete-answer/delete-answer.route'
import { fetchAnswersRoute } from './fetch-answers/fetch-answers.route'

export async function answersRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    answerQuestionRoute,
    deleteAnswerRoute,
    chooseQuestionBestAnswerRoute,
    fetchAnswersRoute
  ])
}
