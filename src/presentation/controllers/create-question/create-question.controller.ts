import { WebController } from '@core/presentation/web-controller'
import { CreateQuestionUseCase } from '@application/usecases/create-question/create-question.usecase'
import { HttpRequest, HttpResponse } from '@infra/adapters/http/ports/http-protocol'
import { QuestionWithTitleAlreadyRegisteredError } from '@application/usecases/create-question/errors/question-with-title-already-registered.error'
import { badRequest, conflict, created } from '@presentation/helpers/http-helpers'

export class CreateQuestionController implements WebController {
  constructor(
    private createQuestionUseCase: CreateQuestionUseCase,
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { title, content } = httpRequest.body
      const { authorId } = httpRequest.user

      const { question } = await this.createQuestionUseCase.execute({
        title,
        content,
        authorId,
      })

      return created(question)
    } catch (error) {
      if (error instanceof QuestionWithTitleAlreadyRegisteredError) {
        return conflict(error)
      }

      throw error
    }
  }
}
