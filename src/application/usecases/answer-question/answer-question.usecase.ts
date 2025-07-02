import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { Answer } from '@/domain/entities/answer/answer.entity'
import type { AnswerProps } from '@/domain/entities/answer/ports/answer.props'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type AnswerQuestionRequest = AnswerProps

export class AnswerQuestionUseCase implements UseCase {
  constructor (
    private readonly answersRepository: AnswersRepository,
    private readonly userRepository: UsersRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: AnswerQuestionRequest): Promise<Answer> {
    const { content, authorId, questionId } = req
    const author = await this.userRepository.findById(authorId)
    if (!author) {
      throw new ResourceNotFoundError('User')
    }

    const answer = Answer.create({ content, authorId, questionId })
    await this.answersRepository.save(answer)
    return answer
  }
}
