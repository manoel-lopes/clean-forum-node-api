import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { Answer } from '@/infra/persistence/typeorm/data-mappers/answer/answer.mapper'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { EditAnswerRequest } from './ports/edit-answer.request'

export class EditAnswerUseCase implements UseCase {
  constructor (private readonly answersRepository: AnswersRepository) {
    Object.freeze(this)
  }

  async execute (req: EditAnswerRequest): Promise<Answer> {
    const { answerId, content } = req
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    const editedAnswer = await this.answersRepository.update({
      id: answerId,
      content,
    })
    return editedAnswer
  }
}
