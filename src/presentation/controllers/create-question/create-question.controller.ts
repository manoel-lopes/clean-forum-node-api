/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { HttpRequest, HttpResponse } from '@/core/presentation/http'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { QuestionWithTitleAlreadyRegisteredError } from '@/domain/application/usecases/create-question/errors/question-with-title-already-registered.error'
import type { Question } from '@/domain/enterprise/entities/question.entity'
import { conflict, created, notFound } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { getAuthenticatedUserId } from '@/shared/util/auth/get-authenticated-user-id'

export class CreateQuestionController implements WebController {
  constructor (private readonly createQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const authorId = getAuthenticatedUserId(req)
      const { title, content, attachments } = req.body
      const question = await this.createQuestionUseCase.execute({ title, content, authorId, attachments })
      return created({ id: (question as Question).id })
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
