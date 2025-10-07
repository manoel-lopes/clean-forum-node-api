import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CommentOnAnswerUseCase } from '@/domain/application/usecases/comment-on-answer/comment-on-answer.usecase'
import { CommentOnAnswerController } from '@/presentation/controllers/comment-on-answer/comment-on-answer.controller'

export function makeCommentOnAnswerController (): WebController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const answerCommentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const commentOnAnswerUseCase = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository)
  return new CommentOnAnswerController(commentOnAnswerUseCase)
}
