import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { DeleteAccountUseCase } from '@/application/usecases/delete-account/delete-account.usecase'

import { DeleteAccountController } from '@/presentation/controllers/delete-account/delete-account.controller'

export function makeDeleteAccountController (): WebController {
  const usersRepository = new InMemoryUsersRepository()
  const deleteAccountUseCase = new DeleteAccountUseCase(usersRepository)
  return new DeleteAccountController(deleteAccountUseCase)
}
