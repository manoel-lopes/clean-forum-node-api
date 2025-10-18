import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class GetQuestionBySlugController implements WebController {
  constructor(private readonly getQuestionBySlugUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { slug } = req.params
      const { page, pageSize, order, include, answerIncludes } = req.query
      const question = await this.getQuestionBySlugUseCase.execute({
        slug,
        page,
        pageSize,
        order,
        include,
        answerIncludes,
      })
      return ok(question)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
