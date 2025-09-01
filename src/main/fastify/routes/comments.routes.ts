import type { FastifyInstance } from 'fastify'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated'
import { deleteAnswerCommentRoute } from './comments/delete-answer-comment.route'
import { deleteQuestionCommentRoute } from './comments/delete-question-comment.route'
import { editAnswerCommentRoute } from './comments/edit-answer-comment.route'
import { editQuestionCommentRoute } from './comments/edit-question-comment.route'
import { fetchAnswerCommentsRoute } from './comments/fetch-answer-comments.route'
import { fetchQuestionCommentsRoute } from './comments/fetch-question-comments.route'

export async function commentsRoutes (app: FastifyInstance) {
  const tags = ['Comments']

  app.register(async (scoped) => {
    scoped.addHook('preHandler', ensureAuthenticated)

    await deleteQuestionCommentRoute(scoped, tags)
    await deleteAnswerCommentRoute(scoped, tags)
    await editQuestionCommentRoute(scoped, tags)
    await editAnswerCommentRoute(scoped, tags)
    await fetchQuestionCommentsRoute(scoped, tags)
    await fetchAnswerCommentsRoute(scoped, tags)
  })
}
