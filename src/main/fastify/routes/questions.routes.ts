import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { fetchQuestionAnswersRoute } from './answers/fetch-question-answers.route'
import { attachToQuestionRoute } from './attachments/attach-to-question.route'
import { deleteQuestionAttachmentRoute } from './attachments/delete-question-attachment.route'
import { updateQuestionAttachmentRoute } from './attachments/update-question-attachment.route'
import { chooseQuestionBestAnswerRoute } from './questions/choose-question-best-answer.route'
import { commentOnQuestionRoute } from './questions/comment-on-question.route'
import { createQuestionRoute } from './questions/create-question.route'
import { deleteQuestionRoute } from './questions/delete-question.route'
import { fetchQuestionsRoute } from './questions/fetch-questions.route'
import { getQuestionBySlugRoute } from './questions/get-question-by-slug.route'
import { updateQuestionRoute } from './questions/update-question.route'

export async function questionsRoutes (app: FastifyInstance) {
  registerRoutes(app, [fetchQuestionsRoute])
  registerRoutes(
    app,
    [
      createQuestionRoute,
      deleteQuestionRoute,
      getQuestionBySlugRoute,
      updateQuestionRoute,
      chooseQuestionBestAnswerRoute,
      commentOnQuestionRoute,
      attachToQuestionRoute,
      updateQuestionAttachmentRoute,
      deleteQuestionAttachmentRoute,
      fetchQuestionAnswersRoute
    ],
    {
      preHandler: [ensureAuthenticated],
    }
  )
}
