import type { WebController } from '@/core/presentation/web-controller'

import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'

import { DeleteAccountUseCase } from '@/application/usecases/delete-account/delete-account.usecase'

import { DeleteAccountController } from '@/presentation/controllers/delete-account/delete-account.controller'

export function makeDeleteAccountController (): WebController {
  const usersRepository = new PrismaUsersRepository()
  const deleteAccountUseCase = new DeleteAccountUseCase(usersRepository)
  return new DeleteAccountController(deleteAccountUseCase)
}
