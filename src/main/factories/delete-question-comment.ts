import type { WebController } from '@/core/presentation/web-controller'
import { DeleteCommentUseCase } from '@/domain/application/usecases/delete-comment/delete-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentController } from '@/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteQuestionCommentController (): WebController {
  const commentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const deleteCommentUseCase = new DeleteCommentUseCase(commentsRepository, questionsRepository, answersRepository)
  return new DeleteCommentController(deleteCommentUseCase)
}
