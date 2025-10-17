import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import type { QuestionIncludeOption } from '@/domain/application/types/questions-include-params'
import { ok } from '@/presentation/helpers/http-helpers'

const VALID_INCLUDE_OPTIONS: readonly string[] = ['comments', 'attachments', 'author']

function isQuestionIncludeOption(value: string): value is QuestionIncludeOption {
  return VALID_INCLUDE_OPTIONS.includes(value)
}

export class FetchQuestionsController implements WebController {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order, include } = req.query
    if (include && Array.isArray(include) && include.length > 0) {
      const validIncludes = include.filter(
        (item): item is QuestionIncludeOption => typeof item === 'string' && isQuestionIncludeOption(item),
      )
      if (validIncludes.length > 0) {
        const questionsWithIncludes = await this.questionsRepository.findManyWithIncludes({
          page,
          pageSize,
          order,
          include: validIncludes,
        })
        return ok(questionsWithIncludes)
      }
    }
    const questions = await this.questionsRepository.findMany({ page, pageSize, order })
    return ok(questions)
  }
}
