import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type {
  AnswerCommentsRepository,
  PaginatedAnswerComments
} from '@/application/repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { ListAnswerCommentsRequest } from './ports/list-answer-comments.request'

export class ListAnswerCommentsUseCase implements UseCase {
  constructor (
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: ListAnswerCommentsRequest): Promise<PaginatedAnswerComments> {
    const { answerId, page, pageSize } = req
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    const comments = await this.answerCommentsRepository.findManyByAnswerId(answer.id, {
      page,
      pageSize
    })
    return comments
  }
}
