import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { DeleteQuestionController } from './delete-question.controller'

describe('DeleteQuestionController', () => {
  let sut: DeleteQuestionController
  let deleteQuestionUseCase: UseCase

  beforeEach(() => {
    deleteQuestionUseCase = new UseCaseStub()
    sut = new DeleteQuestionController(deleteQuestionUseCase)
  })

  const httpRequest = {
    params: {
      id: 'any_id'
    },
    userId: 'any_user_id'
  }

  it('should return 404 and a not found error response if the question is not found', async () => {
    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 403 and a forbidden error response if the user is not the author', async () => {
    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question',
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful question deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
