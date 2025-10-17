import type { WebController } from '@/core/presentation/web-controller'
import { DeleteAnswerCommentUseCase } from '@/domain/application/usecases/delete-answer-comment/delete-answer-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentController } from '@/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteAnswerCommentController(): WebController {
  const answerCommentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(answerCommentsRepository, answersRepository)
  return new DeleteCommentController(deleteAnswerCommentUseCase)
}
