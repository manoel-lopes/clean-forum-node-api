import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'

export type DeleteAnswerRequest = {
  answerId: string
  authorId: string
}

export class DeleteAnswerUseCase implements UseCase {
  constructor (private readonly answersRepository: AnswersRepository) {
    Object.freeze(this)
  }

  async execute (req: DeleteAnswerRequest): Promise<void> {
    const { answerId, authorId } = req
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    if (answer.authorId !== authorId) {
      throw new NotAuthorError('answer')
    }

    await this.answersRepository.delete(answerId)
  }
}
