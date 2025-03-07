import type { HttpServer } from '@/infra/adapters/http/ports/http-server'
import { listQuestionsRoute } from './list-questions/list-questions.route'

export function questionsRoutes (app: HttpServer) {
  app.register(listQuestionsRoute)
}
