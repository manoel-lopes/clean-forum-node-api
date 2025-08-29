import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { QuestionWithTitleAlreadyRegisteredError } from '@/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { conflict, created, notFound } from '@/presentation/helpers/http-helpers'
import { extractToken } from '@/util/auth/extract-token'

export class CreateQuestionController implements WebController {
  constructor (private readonly createQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const token = extractToken(req.headers?.authorization)
      const { sub: authorId } = JWTService.decodeToken(token)
      const { title, content } = req.body
      await this.createQuestionUseCase.execute({ title, content, authorId })
      return created()
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }

      if (error instanceof QuestionWithTitleAlreadyRegisteredError) {
        return conflict(error)
      }
      throw error
    }
  }
}
