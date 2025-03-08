import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { Question } from '@/domain/entities/question/question.entity'
import type { QuestionProps } from '@/domain/entities/question/ports/question.props'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import {
  QuestionWithTitleAlreadyRegisteredError,
} from './errors/question-with-title-already-registered.error'

export type CreateQuestionRequest = QuestionProps

export class CreateQuestionUseCase implements UseCase {
  constructor (
    private readonly questionsRepository: QuestionsRepository,
    private readonly userRepository: UsersRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: CreateQuestionRequest): Promise<Question> {
    const { title, content, authorId, bestAnswerId } = req
    const author = await this.userRepository.findById(authorId)
    if (!author) {
      throw new ResourceNotFoundError('User')
    }

    const questionWithTitle = await this.questionsRepository.findByTitle(title)
    if (questionWithTitle) {
      throw new QuestionWithTitleAlreadyRegisteredError()
    }

    const question = Question.create({
      title,
      content,
      authorId,
      bestAnswerId,
    })
    await this.questionsRepository.save(question)
    return question
  }
}
