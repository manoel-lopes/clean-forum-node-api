import type { PaginationParams } from '@/core/application/pagination-params'
import type { PaginatedUsers, UpdateUserData, UsersRepository } from '@/application/repositories/users.repository'
import { CachedUsersMapper } from '@/infra/persistence/mappers/cached/cached-users.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { User } from '@/domain/entities/user/user.entity'

export class CachedUsersRepository implements UsersRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly usersRepository: UsersRepository
  ) {}

  private entityKey (id: string) {
    return `users:entity:${id}`
  }

  private emailKey (email: string) {
    return `users:email:${email}`
  }

  private paginationKey (params: PaginationParams) {
    const order = params.order ?? 'desc'
    return `users:pagination:page=${params.page}:size=${params.pageSize}:order=${order}`
  }

  private paginationKeysSet () {
    return 'users:pagination:keys'
  }

  private async invalidatePagination () {
    const keys = await this.redis.smembers(this.paginationKeysSet())
    if (keys.length) {
      await this.redis.delete(...keys)
      await this.redis.delete(this.paginationKeysSet())
    }
  }

  async save (user: User): Promise<void> {
    await this.usersRepository.save(user)
    await this.redis.set(this.entityKey(user.id), CachedUsersMapper.toPersistence(user))
    await this.redis.set(this.emailKey(user.email), CachedUsersMapper.toPersistence(user))
    await this.invalidatePagination()
  }

  async update (userData: UpdateUserData): Promise<User> {
    const updated = await this.usersRepository.update(userData)
    await this.redis.set(this.entityKey(updated.id), CachedUsersMapper.toPersistence(updated))
    await this.redis.set(this.emailKey(updated.email), CachedUsersMapper.toPersistence(updated))
    await this.invalidatePagination()
    return updated
  }

  async delete (userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) return
    await this.usersRepository.delete(userId)
    await this.redis.delete(this.entityKey(user.id))
    await this.redis.delete(this.emailKey(user.email))
    await this.invalidatePagination()
  }

  async findById (userId: string): Promise<User | null> {
    const cached = await this.redis.get(this.entityKey(userId))
    if (cached) return CachedUsersMapper.toDomain(cached)
    const user = await this.usersRepository.findById(userId)
    if (user) {
      await this.redis.set(this.entityKey(user.id), CachedUsersMapper.toPersistence(user))
      await this.redis.set(this.emailKey(user.email), CachedUsersMapper.toPersistence(user))
    }
    return user
  }

  async findByEmail (email: string): Promise<User | null> {
    const cached = await this.redis.get(this.emailKey(email))
    if (cached) return CachedUsersMapper.toDomain(cached)
    const user = await this.usersRepository.findByEmail(email)
    if (user) {
      await this.redis.set(this.entityKey(user.id), CachedUsersMapper.toPersistence(user))
      await this.redis.set(this.emailKey(user.email), CachedUsersMapper.toPersistence(user))
    }
    return user
  }

  async findMany (params: PaginationParams): Promise<PaginatedUsers> {
    const key = this.paginationKey(params)
    const cached = await this.redis.get(key)
    if (cached) return CachedUsersMapper.toPaginatedDomain(cached)
    const users = await this.usersRepository.findMany(params)
    await this.redis.set(key, CachedUsersMapper.toPaginatedPersistence(users))
    await this.redis.sadd(this.paginationKeysSet(), key)
    return users
  }
}
