import type { UseCase } from '@/core/domain/application/use-case'
import type {
  AnswersRepository,
  FindManyByQuestionIdParams,
  PaginatedAnswers,
} from '@/domain/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type FetchQuestionAnswersRequest = FindManyByQuestionIdParams

export class FetchQuestionAnswersUseCase implements UseCase {
  constructor (
    private readonly answersRepo: AnswersRepository,
    private readonly questionsRepo: QuestionsRepository
  ) {}

  async execute (req: FetchQuestionAnswersRequest): Promise<PaginatedAnswers> {
    const question = await this.questionsRepo.findById(req.questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const answers = await this.answersRepo.findManyByQuestionId(req)
    return answers
  }
}
