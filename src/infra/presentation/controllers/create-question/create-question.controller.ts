import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { QuestionWithTitleAlreadyRegisteredError } from '@/domain/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { conflict, created, notFound } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { getAuthenticatedUserId } from '@/shared/util/auth/get-authenticated-user-id'
import type { createQuestionBodySchema } from './schemas/create-question.protocol'

export class CreateQuestionController implements WebController {
  constructor (private readonly createQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof createQuestionBodySchema>
  }>): Promise<HttpResponse> {
    try {
      const authorId = getAuthenticatedUserId(req)
      const { title, content, attachments } = req.body
      const response = await this.createQuestionUseCase.execute({ title, content, authorId, attachments })
      return created(response)
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
