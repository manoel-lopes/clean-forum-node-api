import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { DeleteAnswerController } from './delete-answer.controller'

describe('DeleteAnswerController', () => {
  let sut: DeleteAnswerController
  let deleteAnswerUseCase: UseCase

  beforeEach(() => {
    deleteAnswerUseCase = new UseCaseStub()
    sut = new DeleteAnswerController(deleteAnswerUseCase)
  })
  const httpRequest = {
    params: {
      id: 'any_id'
    },
    body: {
      authorId: 'any_author_id'
    }
  }
  it('should return 404 code and a not found error response if the answer is not found', async () => {
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Answer')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 403 and a forbidden error response if the user is not the author', async () => {
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('answer')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the answer',
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful answer deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
