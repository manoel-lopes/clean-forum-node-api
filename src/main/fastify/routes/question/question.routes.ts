import type { FastifyInstance } from 'fastify'

import { createQuestionRoute } from './create-question/create-question.route'
import { answerQuestionRoute } from './answer-question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './choose-question-best-answer/choose-question-best-answer.route'

export async function questionRoutes(app: FastifyInstance) {
  const tags = ['Question']
  app.register(
    async (app) => {
      await createQuestionRoute(app, tags)
      await answerQuestionRoute(app, tags)
      await chooseQuestionBestAnswerRoute(app, tags)
    },
    { prefix: '/questions' },
  )
}
