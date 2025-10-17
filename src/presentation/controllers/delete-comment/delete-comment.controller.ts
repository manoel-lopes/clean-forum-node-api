import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { forbidden, noContent, notFound } from '@/presentation/helpers/http-helpers'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { extractToken } from '@/shared/util/auth/extract-token'

export class DeleteCommentController implements WebController {
  constructor(private readonly deleteCommentUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const { sub: authorId } = JWTService.decodeToken(token)
      await this.deleteCommentUseCase.execute({
        commentId: req.params.commentId,
        authorId,
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
