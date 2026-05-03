import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { forbidden, notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { extractToken } from '@/shared/util/auth/extract-token'
import type { chooseQuestionBestAnswerParamsSchema } from './schemas/choose-question-best-answer.protocol'

export class ChooseQuestionBestAnswerController implements WebController {
  constructor (private readonly chooseQuestionBestAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    params: z.infer<typeof chooseQuestionBestAnswerParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const { sub: authorId } = JWTService.decodeToken(token)
      const response = await this.chooseQuestionBestAnswerUseCase.execute({
        answerId: req.params.answerId,
        authorId,
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
