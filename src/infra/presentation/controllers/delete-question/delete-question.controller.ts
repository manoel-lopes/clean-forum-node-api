import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { forbidden, noContent, notFound } from '@/infra/presentation/helpers/http-helpers'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { extractToken } from '@/shared/util/auth/extract-token'
import type { deleteQuestionParamsSchema } from './schemas/delete-question.protocol'

export class DeleteQuestionController implements WebController {
  constructor (private readonly deleteQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof deleteQuestionParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const decodedToken = JWTService.decodeToken(token)
      const { sub: authorId } = decodedToken
      await this.deleteQuestionUseCase.execute({
        questionId: req.params.questionId,
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
