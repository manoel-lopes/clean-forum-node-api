import type {
  AnswerCommentsRepository
} from '@/application/repositories/answer-comments.repository'
import {
  InMemoryAnswerCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeAnswerComment } from '@/util/factories/domain/make-answer-comment'
import { EditAnswerCommentUseCase } from './edit-answer-comment.usecase'

describe('EditAnswerCommentUseCase', () => {
  let sut: EditAnswerCommentUseCase
  let answerCommentsRepository: AnswerCommentsRepository

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new EditAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should not edit a nonexistent answer comment', async () => {
    await expect(sut.execute({
      commentId: 'any_inexistent_comment_id',
      content: 'new_content',
    })).rejects.toThrowError(new ResourceNotFoundError('Answer comment'))
  })

  it('should edit the answer comment content', async () => {
    const comment = makeAnswerComment('any_answer_id')
    await answerCommentsRepository.save(comment)

    const response = await sut.execute({
      commentId: comment.id,
      content: 'new_content',
    })

    expect(response.id).toBe(comment.id)
    expect(response.content).toBe('new_content')
  })
})
