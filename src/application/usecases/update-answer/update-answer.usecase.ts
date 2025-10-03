import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository, UpdateAnswerData } from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export type UpdateAccountRequest = UpdateAnswerData['data'] & {
  answerId: string
}

export class UpdateAccountUseCase implements UseCase {
  constructor (
    private readonly answersRepository: AnswersRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: UpdateAccountRequest): Promise<Answer> {
    const { answerId, content } = req
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }
    const updatedAnswer = await this.answersRepository.update({
      where: { id: answerId },
      data: { content },
    })
    return updatedAnswer
  }
}
