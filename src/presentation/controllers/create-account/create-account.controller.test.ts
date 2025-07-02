import { CreateAccountController } from './create-account.controller'
import { CreateAccountUseCase } from '@application/usecases/create-account/create-account.usecase'
import { HttpRequest } from '@infra/adapters/http/ports/http-protocol'
import {
  UserWithEmailAlreadyRegisteredError
} from '@application/usecases/create-account/errors/user-with-email-already-registered.error'
import { makeUser } from '@test/util/factories/domain/make-user'

describe('CreateAccountController', () => {
  let createAccountUseCase: CreateAccountUseCase
  let sut: CreateAccountController

  beforeEach(() => {
    createAccountUseCase = { execute: vi.fn() } as unknown as CreateAccountUseCase
    sut = new CreateAccountController(createAccountUseCase)
  })

  it('should return 201 if valid data is provided', async () => {
    const user = makeUser()
    vi.spyOn(createAccountUseCase, 'execute').mockResolvedValueOnce({ user })

    const httpRequest: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(user)
  })

  it('should return 409 if user with email already registered error occurs', async () => {
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValueOnce(new UserWithEmailAlreadyRegisteredError())

    const httpRequest: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toBeInstanceOf(UserWithEmailAlreadyRegisteredError)
  })

  it('should return 500 if any other error occurs', async () => {
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValueOnce(new Error())

    const httpRequest: HttpRequest = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
    }

    const promise = sut.handle(httpRequest)

    await expect(promise).rejects.toThrow(Error)
  })
})
