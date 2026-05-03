import type { WebController } from '@/core/presentation/web-controller'
import { CommentOnQuestionUseCase } from '@/domain/application/usecases/comment-on-question/comment-on-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CommentOnQuestionController } from '@/infra/presentation/controllers/comment-on-question/comment-on-question.controller'

export function makeCommentOnQuestionController (): WebController {
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const questionCommentsRepo = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const commentOnQuestionUseCase = new CommentOnQuestionUseCase(questionsRepo, questionCommentsRepo)
  return new CommentOnQuestionController(commentOnQuestionUseCase)
}
