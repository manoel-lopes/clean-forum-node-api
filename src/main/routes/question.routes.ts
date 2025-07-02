import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { createQuestionRoute } from './question/create-question.route'
import { answerQuestionRoute } from './question/answer-question.route'
import { chooseQuestionBestAnswerRoute } from './question/choose-question-best-answer.route'

export async function questionRoutes (app: HttpServer) {
  createQuestionRoute(app)
  answerQuestionRoute(app)
  chooseQuestionBestAnswerRoute(app)
}
