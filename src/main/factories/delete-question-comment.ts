import type { WebController } from '@/core/presentation/web-controller'
import { DeleteQuestionCommentUseCase } from '@/domain/application/usecases/delete-question-comment/delete-question-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentController } from '@/infra/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteQuestionCommentController (): WebController {
  const questionCommentsRepo = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(questionCommentsRepo, questionsRepo)
  return new DeleteCommentController(deleteQuestionCommentUseCase)
}
