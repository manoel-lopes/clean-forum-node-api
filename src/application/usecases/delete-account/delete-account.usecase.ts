import { UseCase } from '@core/application/use-case'
import { UsersRepository } from '@application/repositories/users.repository'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'

interface DeleteAccountRequest {
  userId: string
}

type DeleteAccountResponse = void

export class DeleteAccountUseCase implements UseCase<DeleteAccountRequest, DeleteAccountResponse> {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  public async execute({ userId }: DeleteAccountRequest): Promise<DeleteAccountResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError(`User with ID "${userId}" not found.`) 
    }

    await this.usersRepository.delete(userId)
  }
}
