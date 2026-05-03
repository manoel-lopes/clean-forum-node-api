import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { created, notFound } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type {
  attachToQuestionBodySchema,
  attachToQuestionParamsSchema,
} from './schemas/attach-to-question.protocol'

export class AttachToQuestionController implements WebController {
  constructor (private readonly attachToQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof attachToQuestionBodySchema>
    params: z.infer<typeof attachToQuestionParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const { title, url } = req.body
      const response = await this.attachToQuestionUseCase.execute({
        questionId: req.params.questionId,
        title,
        url,
      })
      return created(response)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
