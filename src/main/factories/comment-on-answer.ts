import type { WebController } from '@/core/presentation/web-controller'
import { CommentOnAnswerUseCase } from '@/domain/application/usecases/comment-on-answer/comment-on-answer.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CommentOnAnswerController } from '@/infra/presentation/controllers/comment-on-answer/comment-on-answer.controller'

export function makeCommentOnAnswerController (): WebController {
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const answerCommentsRepo = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const commentOnAnswerUseCase = new CommentOnAnswerUseCase(answersRepo, answerCommentsRepo)
  return new CommentOnAnswerController(commentOnAnswerUseCase)
}
