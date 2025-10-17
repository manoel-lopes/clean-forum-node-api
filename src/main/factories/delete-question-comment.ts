import type { WebController } from '@/core/presentation/web-controller'
import { DeleteQuestionCommentUseCase } from '@/domain/application/usecases/delete-question-comment/delete-question-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentController } from '@/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteQuestionCommentController(): WebController {
  const questionCommentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(questionCommentsRepository, questionsRepository)
  return new DeleteCommentController(deleteQuestionCommentUseCase)
}
