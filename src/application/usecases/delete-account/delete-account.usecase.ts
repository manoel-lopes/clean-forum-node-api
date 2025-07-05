import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { UseCase } from '@/core/application/use-case'

export type DeleteAccountRequest = {
  userId: string
}

export class DeleteAccountUseCase implements UseCase {
  constructor (private readonly usersRepository: UsersRepository) {
    Object.freeze(this)
  }

  async execute (req: DeleteAccountRequest): Promise<void> {
    const { userId } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError('User')
    }
    await this.usersRepository.delete(userId)
  }
}
