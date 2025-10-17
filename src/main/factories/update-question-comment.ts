import type { WebController } from '@/core/presentation/web-controller'
import { UpdateCommentUseCase } from '@/domain/application/usecases/update-comment/update-comment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateCommentController } from '@/presentation/controllers/update-comment/update-comment.controller'

export function makeUpdateQuestionCommentController(): WebController {
  const commentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const updateQuestionCommentUseCase = new UpdateCommentUseCase(commentsRepository)
  return new UpdateCommentController(updateQuestionCommentUseCase)
}
