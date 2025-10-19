import type { FastifyInstance } from 'fastify'
import { registerRoutes } from '@/main/fastify/helpers/register-routes'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { answerQuestionRoute } from './answers/answer-question.route'
import { commentOnAnswerRoute } from './answers/comment-on-answer.route'
import { deleteAnswerRoute } from './answers/delete-answer.route'
import { updateAnswerRoute } from './answers/update-answer.route'
import { attachToAnswerRoute } from './attachments/attach-to-answer.route'
import { deleteAnswerAttachmentRoute } from './attachments/delete-answer-attachment.route'
import { updateAnswerAttachmentRoute } from './attachments/update-answer-attachment.route'

export async function answersRoutes (app: FastifyInstance) {
  registerRoutes(
    app,
    [
      answerQuestionRoute,
      deleteAnswerRoute,
      updateAnswerRoute,
      commentOnAnswerRoute,
      attachToAnswerRoute,
      updateAnswerAttachmentRoute,
      deleteAnswerAttachmentRoute,
    ],
    {
      preHandler: [ensureAuthenticated],
    }
  )
}
