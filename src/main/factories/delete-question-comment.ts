import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentUseCase } from '@/application/usecases/delete-comment/delete-comment.usecase'
import { DeleteCommentController } from '@/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteQuestionCommentController (): WebController {
  const commentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const deleteCommentUseCase = new DeleteCommentUseCase(commentsRepository, questionsRepository, answersRepository)
  return new DeleteCommentController(deleteCommentUseCase)
}
