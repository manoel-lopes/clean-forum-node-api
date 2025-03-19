import type { UseCase } from '@/core/application/use-case'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type {
  AnswersRepository,
  PaginatedAnswers
} from '@/application/repositories/answers.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type ListAnswersByQuestionRequest = PaginationParams & {
  questionId: string
}

export class ListQuestionAnswersUseCase implements UseCase {
  constructor (
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepository: AnswersRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: ListAnswersByQuestionRequest): Promise<PaginatedAnswers> {
    const { questionId, page, pageSize } = req
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const answers = await this.answersRepository.findManyByQuestionId(question.id, {
      page,
      pageSize,
    })
    return answers
  }
}
