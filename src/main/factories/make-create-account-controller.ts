import { CreateAccountUseCase } from '@/application/usecases/create-account/create-account.usecase'
import { BcryptAdapter } from '@/infra/adapters/crypto/bcrypt/bcrypt.adapter'
import {
  CreateAccountSchemaValidator,
} from '@/infra/validation/schemas/zod/create-account-schema.validator'
import {
  InMemoryUsersRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { CacheUsersRepository } from '@/infra/persistence/repositories/cache/cache-users.repository'
import { RedisProvider } from '@/infra/providers/cache/redis/redis.provider'
import {
  CreateAccountController,
} from '@/presentation/controllers/create-account/create-account.controller'
import { env } from '@/lib/env'

export function makeCreateAccountController () {
  const bcryptAdapter = new BcryptAdapter()
  const drizzleUsersRepository = new InMemoryUsersRepository()
  const redisProvider = new RedisProvider()
  const cacheUsersRepository = new CacheUsersRepository(drizzleUsersRepository, redisProvider)
  const usersRepository = env.NODE_ENV !== 'test' ? cacheUsersRepository : drizzleUsersRepository
  const createAccountSchemaValidator = new CreateAccountSchemaValidator()
  const createAccountUseCase = new CreateAccountUseCase(usersRepository, bcryptAdapter)
  return new CreateAccountController(createAccountSchemaValidator, createAccountUseCase)
}
