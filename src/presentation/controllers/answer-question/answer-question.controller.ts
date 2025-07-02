import { WebController } from '@core/presentation/web-controller'
import { AnswerQuestionUseCase } from '@application/usecases/answer-question/answer-question.usecase'
import { HttpRequest, HttpResponse } from '@infra/adapters/http/ports/http-protocol'
import { created } from '@presentation/helpers/http-helpers'

export class AnswerQuestionController implements WebController {
  constructor (private answerQuestionUseCase: AnswerQuestionUseCase) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { content } = httpRequest.body
    const { questionId } = httpRequest.params
    const { authorId } = httpRequest.user

    const { answer } = await this.answerQuestionUseCase.execute({
      content,
      authorId,
      questionId,
    })

    return created(answer)
  }
}
