import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { Answer } from '@/domain/models/answer/answer.model'
import type { Optional } from '@/util/types/optional'

export type AnswerQuestionRequest = Optional<Omit<Answer, 'id' | 'excerpt'>, 'createdAt' | 'updatedAt'>

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
    const answer = new Answer(content, questionId, authorId)
    await this.answersRepository.save(answer)
    return answer
  }
}
