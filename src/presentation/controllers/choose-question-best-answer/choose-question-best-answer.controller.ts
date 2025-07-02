import { WebController } from '@core/presentation/web-controller'
import {
  ChooseQuestionBestAnswerUseCase
} from '@application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'
import { HttpRequest, HttpResponse } from '@infra/adapters/http/ports/http-protocol'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'
import { NotAuthorError } from '@application/errors/not-author.error'
import { noContent, forbidden, notFound } from '@presentation/helpers/http-helpers'

export class ChooseQuestionBestAnswerController implements WebController {
  constructor (private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { answerId } = httpRequest.params
      const { authorId } = httpRequest.user

      await this.chooseQuestionBestAnswerUseCase.execute({
        answerId,
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
