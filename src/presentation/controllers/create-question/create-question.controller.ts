import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { QuestionWithTitleAlreadyRegisteredError } from '@/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { conflict, created, notFound } from '@/presentation/helpers/http-helpers'

export class CreateQuestionController implements WebController {
  constructor (private readonly createQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { title, content, authorId } = req.body
      await this.createQuestionUseCase.execute({ title, content, authorId })
      return created()
    } catch (error) {
      if (error instanceof QuestionWithTitleAlreadyRegisteredError) {
        return conflict(error)
      }
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
