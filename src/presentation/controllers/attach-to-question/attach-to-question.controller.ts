import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { created, notFound } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class AttachToQuestionController implements WebController {
  constructor (private readonly attachToQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { questionId } = req.params
      const { title, url } = req.body
      const attachment = await this.attachToQuestionUseCase.execute({
        questionId,
        title,
        url,
      })
      return created(attachment)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
