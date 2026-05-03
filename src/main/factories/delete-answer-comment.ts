import type { WebController } from '@/core/presentation/web-controller'
import { DeleteAnswerCommentUseCase } from '@/domain/application/usecases/delete-answer-comment/delete-answer-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentController } from '@/infra/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteAnswerCommentController (): WebController {
  const answerCommentsRepo = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(answerCommentsRepo, answersRepo)
  return new DeleteCommentController(deleteAnswerCommentUseCase)
}
