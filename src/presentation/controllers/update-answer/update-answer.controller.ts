import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { getAuthenticatedUserId } from '@/shared/util/auth/get-authenticated-user-id'

export class UpdateAnswerController implements WebController {
  constructor (private readonly updateAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const authorId = getAuthenticatedUserId(req)
      const { answerId } = req.params
      const { content } = req.body
      const answer = await this.updateAnswerUseCase.execute({
        answerId,
        content,
        authorId
      })
      return ok({ answer })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      if (error instanceof NotAuthorError) {
        return notFound(error)
      }
      throw error
    }
  }
}
