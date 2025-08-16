import type { UseCase } from '@/core/application/use-case'
import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type DeleteAccountRequest = {
  userId: string
}
export class DeleteAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: DeleteAccountRequest): Promise<void> {
    const { userId } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError('User')
    }
    await this.refreshTokensRepository.deleteManyByUserId(userId)
    await this.usersRepository.delete(userId)
  }
}
