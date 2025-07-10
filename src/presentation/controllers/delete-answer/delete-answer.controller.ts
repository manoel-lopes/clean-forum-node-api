import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { forbidden, noContent, notFound } from '@/presentation/helpers/http-helpers'

export class DeleteAnswerController implements WebController {
  constructor (private readonly deleteAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      await this.deleteAnswerUseCase.execute({
        answerId: req.params.answerId,
        authorId: req.body.authorId
      })
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
