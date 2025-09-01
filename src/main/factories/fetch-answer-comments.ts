import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchAnswerCommentsUseCase } from '@/application/usecases/fetch-answer-comments/fetch-answer-comments.usecase'
import { FetchAnswerCommentsController } from '@/presentation/controllers/fetch-answer-comments/fetch-answer-comments.controller'

export function makeFetchAnswerCommentsController (): WebController {
  const answerCommentsRepository = CachedRepositoriesFactory.createAnswerCommentsRepository()
  const fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  return new FetchAnswerCommentsController(fetchAnswerCommentsUseCase)
}
