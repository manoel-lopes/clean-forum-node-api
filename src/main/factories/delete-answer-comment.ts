import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteCommentUseCase } from '@/application/usecases/delete-comment/delete-comment.usecase'
import { DeleteCommentController } from '@/presentation/controllers/delete-comment/delete-comment.controller'

export function makeDeleteAnswerCommentController (): WebController {
  const commentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const deleteCommentUseCase = new DeleteCommentUseCase(commentsRepository)
  return new DeleteCommentController(deleteCommentUseCase)
}
