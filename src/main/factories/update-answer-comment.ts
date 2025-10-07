import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateCommentUseCase } from '@/domain/application/usecases/update-comment/update-comment.usecase'
import { UpdateCommentController } from '@/presentation/controllers/update-comment/update-comment.controller'

export function makeUpdateAnswerCommentController (): WebController {
  const commentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const updateAnswerCommentUseCase = new UpdateCommentUseCase(commentsRepository)
  return new UpdateCommentController(updateAnswerCommentUseCase)
}
