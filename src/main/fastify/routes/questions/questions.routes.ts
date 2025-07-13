import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { createQuestionRoute } from './create-question/create-question.route'
import { deleteQuestionRoute } from './delete-question/delete-question.route'
import { fetchQuestionsRoute } from './fetch-questions/fetch-questions.route'
import { getQuestionBySlugRoute } from './get-question-by-slug/get-question-by-slug.route'

export async function questionsRoutes (app: FastifyInstance) {
  registerRoutes(app, [
    createQuestionRoute,
    deleteQuestionRoute,
    getQuestionBySlugRoute,
    fetchQuestionsRoute
  ])
}
