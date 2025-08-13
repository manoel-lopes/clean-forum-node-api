import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/jwt-service'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { created, notFound } from '@/presentation/helpers/http-helpers'

export class AnswerQuestionController implements WebController {
  constructor (private readonly answerQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { questionId, content } = req.body
      const token = req.headers?.authorization ?? ''
      const { sub: authorId } = JWTService.decodeToken(token)
      await this.answerQuestionUseCase.execute({
        questionId,
        content,
        authorId
      })
      return created()
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
