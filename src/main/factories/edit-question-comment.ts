import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { EditCommentUseCase } from '@/application/usecases/edit-comment/edit-comment.usecase'
import { EditCommentController } from '@/presentation/controllers/edit-comment/edit-comment.controller'

export function makeEditQuestionCommentController (): WebController {
  const commentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const editQuestionCommentUseCase = new EditCommentUseCase(commentsRepository)
  return new EditCommentController(editQuestionCommentUseCase)
}
