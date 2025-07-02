import { UseCase } from '@core/application/use-case'
import { QuestionsRepository } from '@application/repositories/questions.repository'
import { AnswersRepository } from '@application/repositories/answers.repository'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'
import { NotAuthorError } from '@application/errors/not-author.error'
import { Question } from '@domain/entities/question/question.entity'

interface ChooseQuestionBestAnswerRequest {
  answerId: string
  authorId: string
}

interface ChooseQuestionBestAnswerResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase implements UseCase<ChooseQuestionBestAnswerRequest, ChooseQuestionBestAnswerResponse> {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  public async execute({ answerId, authorId }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new ResourceNotFoundError(`Answer with ID "${answerId}" not found.`)
    }

    const question = await this.questionsRepository.findById(answer.questionId)

    if (!question) {
      throw new ResourceNotFoundError(`Question with ID "${answer.questionId}" not found.`)
    }

    if (question.authorId !== authorId) {
      throw new NotAuthorError('Question')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
