import type { AnswerAttachmentsRepository } from '@/domain/application/repositories/answer-attachments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswerAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-attachments.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { AttachToAnswerUseCase } from './attach-to-answer.usecase'

describe('AttachToAnswerUseCase', () => {
  let sut: AttachToAnswerUseCase
  let answersRepository: AnswersRepository
  let answerAttachmentsRepository: AnswerAttachmentsRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sut = new AttachToAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should throw error when answer does not exist', async () => {
    const request = {
      answerId: 'non-existent-id',
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Answer'))
  })

  it('should attach a file to an answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const request = {
      answerId: answer.id,
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    }

    const result = await sut.execute(request)

    expect(result.answerId).toBe(answer.id)
    expect(result.title).toBe('Test Document')
    expect(result.url).toBe('https://example.com/test.pdf')
  })
})
