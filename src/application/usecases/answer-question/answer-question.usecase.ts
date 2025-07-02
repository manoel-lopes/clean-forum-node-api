import { UseCase } from '@core/application/use-case'
import { Answer } from '@domain/entities/answer/answer.entity'
import { AnswersRepository } from '@application/repositories/answers.repository'

interface AnswerQuestionRequest {
  content: string
  authorId: string
  questionId: string
}

interface AnswerQuestionResponse {
  answer: Answer
}

export class AnswerQuestionUseCase implements UseCase<AnswerQuestionRequest, AnswerQuestionResponse> {
  constructor(
    private answersRepository: AnswersRepository,
  ) {}

  public async execute({ content, authorId, questionId }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId,
      questionId,
    })

    await this.answersRepository.create(answer)

    return {
      answer,
    }
  }
}
