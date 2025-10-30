import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class FetchQuestionAnswersController implements WebController {
  constructor (private readonly fetchQuestionAnswersUseCase: UseCase) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { questionId } = httpRequest.params
      const { page = 1, pageSize = 20, order = 'desc', include } = httpRequest.query
      const answers = await this.fetchQuestionAnswersUseCase.execute({
        questionId,
        page,
        pageSize,
        order,
        include,
      })
      return ok(answers)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
