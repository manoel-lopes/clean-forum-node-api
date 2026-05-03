import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { ok } from '@/infra/presentation/helpers/http-helpers'
import type { paginationWithIncludeParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'

export class FetchQuestionsController implements WebController {
  constructor (private readonly questionsRepo: QuestionsRepository) {}

  async handle (req: HttpRequest<{
    query: z.infer<typeof paginationWithIncludeParamsSchema>
  }>): Promise<HttpResponse> {
    const { page, pageSize, order, include } = req.query
    const response = await this.questionsRepo.findMany({
      page,
      pageSize,
      order,
      include,
    })
    return ok(response)
  }
}
