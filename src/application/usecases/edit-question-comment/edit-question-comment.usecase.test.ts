import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import {
  InMemoryQuestionCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeQuestionComment } from '@/util/factories/domain/make-question-comment'
import { EditQuestionCommentUseCase } from './edit-question-comment.usecase'

describe('EditQuestionCommentUseCase', () => {
  let sut: EditQuestionCommentUseCase
  let questionCommentsRepository: QuestionCommentsRepository

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new EditQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should not edit a nonexistent question comment', async () => {
    await expect(sut.execute({
      commentId: 'any_inexistent_comment_id',
      content: 'new_content',
    })).rejects.toThrowError(new ResourceNotFoundError('Question comment'))
  })

  it('should edit the question comment content', async () => {
    const comment = makeQuestionComment('any_question_id')
    await questionCommentsRepository.save(comment)

    const response = await sut.execute({
      commentId: comment.id,
      content: 'new_content',
    })

    expect(response.id).toBe(comment.id)
    expect(response.content).toBe('new_content')
  })
})
