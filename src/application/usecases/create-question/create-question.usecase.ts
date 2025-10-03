import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { QuestionProps } from '@/domain/entities/question/ports/question.props'
import { Question } from '@/domain/entities/question/question.entity'
import { QuestionWithTitleAlreadyRegisteredError } from './errors/question-with-title-already-registered.error'
import type { OmitTimestamps } from '@/shared/types/custom/omit-timestamps'

type CreateQuestionRequest = OmitTimestamps<QuestionProps>

export class CreateQuestionUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {}

  async execute (req: CreateQuestionRequest): Promise<Question> {
    const { title, content, authorId, bestAnswerId } = req
    const questionWithTitle = await this.questionsRepository.findByTitle(title)
    if (questionWithTitle) {
      throw new QuestionWithTitleAlreadyRegisteredError()
    }
    const question = Question.create({
      title,
      content,
      authorId,
      bestAnswerId
    })
    await this.questionsRepository.save(question)
    return question
  }
}
