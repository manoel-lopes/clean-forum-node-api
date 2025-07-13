import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { forbidden, notFound, ok } from '@/presentation/helpers/http-helpers'

export class ChooseQuestionBestAnswerController implements WebController {
  constructor (private readonly chooseQuestionBestAnswerUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const question = await this.chooseQuestionBestAnswerUseCase.execute({
        answerId: req.params.answerId,
        authorId: req.body.authorId
      })
      return ok(question)
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
