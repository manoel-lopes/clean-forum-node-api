import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { created, notFound } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type {
  attachToAnswerBodySchema,
  attachToAnswerParamsSchema,
} from './schemas/attach-to-answer.protocol'

export class AttachToAnswerController implements WebController {
  constructor (private readonly attachToAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof attachToAnswerBodySchema>
    params: z.infer<typeof attachToAnswerParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const { title, url } = req.body
      const response = await this.attachToAnswerUseCase.execute({
        answerId: req.params.answerId,
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
