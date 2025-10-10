import type { WebController } from '@/core/presentation/web-controller'
import { CommentOnQuestionUseCase } from '@/domain/application/usecases/comment-on-question/comment-on-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CommentOnQuestionController } from '@/presentation/controllers/comment-on-question/comment-on-question.controller'

export function makeCommentOnQuestionController (): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const questionCommentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const commentOnQuestionUseCase = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository)
  return new CommentOnQuestionController(commentOnQuestionUseCase)
}
