import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { notFound, ok } from '@/presentation/helpers/http-helpers'

export class GetQuestionBySlugController implements WebController {
  constructor (private readonly getQuestionBySlugUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { slug, page, pageSize, order } = req.query
      const question = await this.getQuestionBySlugUseCase.execute({ slug, page, pageSize, order })
      return ok(question)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
