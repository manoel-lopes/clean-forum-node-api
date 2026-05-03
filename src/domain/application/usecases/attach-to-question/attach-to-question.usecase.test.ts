import { makeQuestionData } from 'tests/factories/domain/make-question'
import type { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { InMemoryQuestionAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-attachments.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { AttachToQuestionUseCase } from './attach-to-question.usecase'

describe('AttachToQuestionUseCase', () => {
  let sut: AttachToQuestionUseCase
  let questionsRepo: QuestionsRepository
  let questionAttachmentsRepository: QuestionAttachmentsRepository

  beforeEach(() => {
    questionsRepo = new InMemoryQuestionsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new AttachToQuestionUseCase(questionsRepo, questionAttachmentsRepository)
  })

  it('should throw error when question does not exist', async () => {
    const request = {
      questionId: 'non-existent-id',
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Question'))
  })

  it('should attach a file to a question', async () => {
    const question = await questionsRepo.create(makeQuestionData())

    const request = {
      questionId: question.id,
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    }

    const response = await sut.execute(request)

    expect(response.questionId).toBe(question.id)
    expect(response.title).toBe('Test Document')
    expect(response.url).toBe('https://example.com/test.pdf')
  })
})
