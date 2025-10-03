import type { UseCase } from '@/core/application/use-case'
import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'

type DeleteAccountRequest = {
  userId: string
}

export class DeleteAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {}

  async execute (req: DeleteAccountRequest): Promise<void> {
    const { userId } = req
    await this.refreshTokensRepository.deleteManyByUserId(userId)
    await this.usersRepository.delete(userId)
  }
}
