import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type {
  getQuestionBySlugParamsSchema,
  getQuestionBySlugQuerySchema,
} from './schemas/get-question-by-slug.protocol'

export class GetQuestionBySlugController implements WebController {
  constructor (private readonly getQuestionBySlugUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof getQuestionBySlugParamsSchema>
    query: z.infer<typeof getQuestionBySlugQuerySchema>
  }>): Promise<HttpResponse> {
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
