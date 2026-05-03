import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { getAuthenticatedUserId } from '@/shared/util/auth/get-authenticated-user-id'
import type {
  updateQuestionBodySchema,
  updateQuestionParamsSchema,
} from './schemas/update-question.protocol'

export class UpdateQuestionController implements WebController {
  constructor (private readonly updateQuestionUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof updateQuestionBodySchema>
    params: z.infer<typeof updateQuestionParamsSchema>
  }>): Promise<HttpResponse> {
    try {
      const authorId = getAuthenticatedUserId(req)
      const { questionId } = req.params
      const { title, content } = req.body
      const question = await this.updateQuestionUseCase.execute({
        questionId,
        title,
        content,
        authorId,
      })
      return ok({ question })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      if (error instanceof NotAuthorError) {
        return notFound(error)
      }
      throw error
    }
  }
}
