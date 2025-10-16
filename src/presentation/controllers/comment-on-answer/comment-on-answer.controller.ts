import type { HttpRequest, HttpResponse } from '@/core/presentation/http'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { created, notFound } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { extractToken } from '@/shared/util/auth/extract-token'

export class CommentOnAnswerController implements WebController {
  constructor (private readonly commentOnAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const decodedToken = JWTService.decodeToken(token)
      const { sub: authorId } = decodedToken
      const { answerId, content } = req.body
      const response = await this.commentOnAnswerUseCase.execute({
        authorId,
        answerId,
        content
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
