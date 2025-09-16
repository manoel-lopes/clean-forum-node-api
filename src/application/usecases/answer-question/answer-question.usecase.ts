import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { Answer } from '@/domain/entities/answer/answer.entity'
import type { AnswerProps } from '@/domain/entities/answer/ports/answer.props'

type AnswerQuestionRequest = AnswerProps

export class AnswerQuestionUseCase implements UseCase {
  constructor (
    private readonly answersRepository: AnswersRepository,
    private readonly userRepository: UsersRepository,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async execute (req: AnswerQuestionRequest): Promise<Answer> {
    const { content, authorId, questionId } = req
    const author = await this.userRepository.findById(authorId)
    if (!author) {
      throw new ResourceNotFoundError('User')
    }
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const answer = Answer.create({ content, authorId, questionId })
    await this.answersRepository.save(answer)
    return answer
  }
}
