import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'

export type ChooseQuestionBestAnswerRequest = {
  authorId: string
  answerId: string
}

export class ChooseQuestionBestAnswerUseCase implements UseCase {
  constructor (
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepository: AnswersRepository
  ) {
    Object.freeze(this)
  }

  async execute ({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerRequest): Promise<Question> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    const question = await this.questionsRepository.findById(answer.questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    if (authorId !== question.authorId) {
      throw new NotAuthorError('question')
    }

    const editedQuestion = await this.questionsRepository.update({
      id: question.id,
      bestAnswerId: answer.id,
    })
    return editedQuestion
  }
}
