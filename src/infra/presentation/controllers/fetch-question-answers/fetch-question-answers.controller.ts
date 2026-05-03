import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type {
  fetchQuestionAnswersParamsSchema,
  fetchQuestionAnswersQuerySchema,
} from './schemas/fetch-question-answers.protocol'

export class FetchQuestionAnswersController implements WebController {
  constructor (private readonly fetchQuestionAnswersUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof fetchQuestionAnswersParamsSchema>
    query: z.infer<typeof fetchQuestionAnswersQuerySchema>
  }>): Promise<HttpResponse> {
    try {
      const { questionId } = req.params
      const { page = 1, pageSize = 20, order = 'desc', include } = req.query
      const response = await this.fetchQuestionAnswersUseCase.execute({
        questionId,
        page,
        pageSize,
        order,
        include,
      })
      return ok(response)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
