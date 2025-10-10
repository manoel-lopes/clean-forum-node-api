import type { WebController } from '@/core/presentation/web-controller'
import { FetchQuestionCommentsUseCase } from '@/domain/application/usecases/fetch-question-comments/fetch-question-comments.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionCommentsController } from '@/presentation/controllers/fetch-question-comments/fetch-question-comments.controller'

export function makeFetchQuestionCommentsController (): WebController {
  const questionCommentsRepository = CachedRepositoriesFactory.createQuestionCommentsRepository()
  const fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  return new FetchQuestionCommentsController(fetchQuestionCommentsUseCase)
}
