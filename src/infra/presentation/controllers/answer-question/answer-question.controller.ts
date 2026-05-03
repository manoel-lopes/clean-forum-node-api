import type z from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { created, notFound } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { extractToken } from '@/shared/util/auth/extract-token'
import { answerQuestionBodySchema } from './schemas/answer-question.protocol'

export class AnswerQuestionController implements WebController {
  constructor (private readonly answerQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof answerQuestionBodySchema>
  }>): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const decodedToken = JWTService.decodeToken(token)
      const { sub: authorId } = decodedToken
      const { questionId, content } = req.body
      const response = await this.answerQuestionUseCase.execute({
        authorId,
        questionId,
        content,
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
