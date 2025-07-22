import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { ChooseQuestionBestAnswerController } from './choose-question-best-answer.controller'

describe('ChooseQuestionBestAnswerController', () => {
  let sut: ChooseQuestionBestAnswerController
  let chooseQuestionBestAnswerUseCase: UseCase
  beforeEach(() => {
    chooseQuestionBestAnswerUseCase = new UseCaseStub()
    sut = new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
  })
  const httpRequest = {
    params: {
      answerId: 'any_answer_id'
    },
    body: {
      authorId: 'any_author_id'
    }
  }
  it('should return 404 code and an not found error response if the answer or question is not found', async () => {
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Answer')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found'
    })
  })

  it('should return 403 and an forbidden error response if the user is not the author', async () => {
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('question')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question'
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the updated question data on success', async () => {
    const question = {
      id: 'any_question_id',
      title: 'any_title',
      content: 'any_content',
      authorId: 'any_author_id',
      bestAnswerId: 'any_answer_id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockResolvedValue(question)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(question)
  })
})
