import type { WebController } from '@/core/presentation/web-controller'
import { FetchAnswerCommentsUseCase } from '@/domain/application/usecases/fetch-answer-comments/fetch-answer-comments.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchAnswerCommentsController } from '@/presentation/controllers/fetch-answer-comments/fetch-answer-comments.controller'

export function makeFetchAnswerCommentsController (): WebController {
  const answerCommentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  return new FetchAnswerCommentsController(fetchAnswerCommentsUseCase)
}
