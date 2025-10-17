import type { UseCase } from '@/core/domain/application/use-case'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
} from '@/domain/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type GetQuestionBySlugRequest = FindQuestionBySlugParams

export type GetQuestionBySlugResponse = NonNullable<FindQuestionsResult>

export class GetQuestionBySlugUseCase implements UseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
    page = 1,
    pageSize = 10,
    order = 'desc',
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug({
      slug,
      page,
      pageSize,
      order,
    })
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    return question
  }
}
