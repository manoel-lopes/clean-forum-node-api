import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { ok } from '@/infra/presentation/helpers/http-helpers'
import type {
  fetchUserQuestionsParamsSchema,
  fetchUserQuestionsQuerySchema,
} from './schemas/fetch-user-questions.protocol'

export class FetchUserQuestionsController implements WebController {
  constructor (private readonly fetchUserQuestionsUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof fetchUserQuestionsParamsSchema>
    query: z.infer<typeof fetchUserQuestionsQuerySchema>
  }>): Promise<HttpResponse> {
    const { userId } = req.params
    const { page, pageSize, order } = req.query
    const questions = await this.fetchUserQuestionsUseCase.execute({ userId, page, pageSize, order })
    return ok(questions)
  }
}
