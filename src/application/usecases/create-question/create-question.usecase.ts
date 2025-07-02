import { UseCase } from '@core/application/use-case'
import { Question } from '@domain/entities/question/question.entity'
import { QuestionsRepository } from '@application/repositories/questions.repository'
import { QuestionWithTitleAlreadyRegisteredError } from './errors/question-with-title-already-registered.error'

interface CreateQuestionRequest {
  title: string
  content: string
  authorId: string
}

interface CreateQuestionResponse {
  question: Question
}

export class CreateQuestionUseCase implements UseCase<CreateQuestionRequest, CreateQuestionResponse> {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  public async execute({ title, content, authorId }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const questionWithSameTitle = await this.questionsRepository.findBySlug(Question.create({ title, content, authorId }).slug.value)

    if (questionWithSameTitle) {
      throw new QuestionWithTitleAlreadyRegisteredError()
    }

    const question = Question.create({
      title,
      content,
      authorId,
    })

    await this.questionsRepository.create(question)

    return {
      question,
    }
  }
}
