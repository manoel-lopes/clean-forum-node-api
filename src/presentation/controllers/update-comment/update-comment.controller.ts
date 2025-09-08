import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { forbidden, notFound, ok } from '@/presentation/helpers/http-helpers'
import { extractToken } from '@/util/auth/extract-token'

export class UpdateCommentController implements WebController {
  constructor (private readonly updateCommentUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const { sub: authorId } = JWTService.decodeToken(token)
      const { content } = req.body
      const response = await this.updateCommentUseCase.execute({
        commentId: req.params.commentId,
        authorId,
        content
      })
      return ok(response)
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
