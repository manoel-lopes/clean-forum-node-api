import type { UseCase } from '@/core/domain/application/use-case'
import type {
  AnswersRepository,
  FindManyByQuestionIdParams,
  PaginatedAnswersWithIncludes,
} from '@/domain/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class FetchQuestionAnswersUseCase implements UseCase {
  constructor (
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async execute (req: FindManyByQuestionIdParams): Promise<PaginatedAnswersWithIncludes> {
    const question = await this.questionsRepository.findById(req.questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const answers = await this.answersRepository.findManyByQuestionId(req)
    return answers
  }
}
