import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { forbidden, noContent, notFound } from '@/presentation/helpers/http-helpers'

export class DeleteQuestionController implements WebController {
  constructor (private readonly deleteQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = req.params
      const { userId } = req
      await this.deleteQuestionUseCase.execute({ questionId: id, authorId: userId })
      return noContent()
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      if (error instanceof NotAuthorError) {
        return forbidden(error)
      }
      throw error
    }
  }
}
