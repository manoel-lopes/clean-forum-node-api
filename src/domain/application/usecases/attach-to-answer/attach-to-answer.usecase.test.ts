import type { AnswerAttachmentsRepository } from '@/domain/application/repositories/answer-attachments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswerAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-attachments.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { createAndSave, expectEntityToMatch } from '@/shared/util/test/test-helpers'
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
    const answer = await createAndSave(makeAnswer, answersRepository)
    const request = {
      answerId: answer.id,
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    }

    const result = await sut.execute(request)

    expectEntityToMatch(result, {
      answerId: answer.id,
      title: 'Test Document',
      url: 'https://example.com/test.pdf',
    })
  })
})
