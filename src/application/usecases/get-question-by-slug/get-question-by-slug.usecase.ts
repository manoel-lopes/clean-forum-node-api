import { UseCase } from '@core/application/use-case'
import { Question } from '@domain/entities/question/question.entity'
import { QuestionsRepository } from '@application/repositories/questions.repository'

interface GetQuestionBySlugRequest {
  slug: string
}

interface GetQuestionBySlugResponse {
  question: Question
}

export class GetQuestionBySlugUseCase implements UseCase<GetQuestionBySlugRequest, GetQuestionBySlugResponse> {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  public async execute({ slug }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Question not found')
    }

    return {
      question,
    }
  }
}
