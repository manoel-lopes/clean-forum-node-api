import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  PaginatedUsers,
  UpdateUserData,
  UsersRepository
} from '@/application/repositories/users.repository'
import { CachedUsersMapper } from '@/infra/persistence/mappers/cached/cached-users.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { User } from '@/domain/entities/user/user.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedUsersRepository extends BaseCachedRepository implements UsersRepository {
  private readonly keyPrefix = 'users'

  constructor (
    redis: RedisService,
    private readonly usersRepository: UsersRepository
  ) {
    super(redis)
  }

  private userKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private userEmailKey (email: string): string {
    return this.emailKey(this.keyPrefix, email)
  }

  private usersPaginationKey (params: PaginationParams): string {
    return this.paginationKey(this.keyPrefix, params)
  }

  async save (user: User): Promise<void> {
    await this.usersRepository.save(user)
    await this.cacheSet(this.userKey(user.id), CachedUsersMapper.toPersistence(user))
    await this.cacheSet(this.userEmailKey(user.email), CachedUsersMapper.toPersistence(user))
  }

  async update (userData: UpdateUserData): Promise<User> {
    const updated = await this.usersRepository.update(userData)
    await this.cacheSet(this.userKey(updated.id), CachedUsersMapper.toPersistence(updated))
    await this.cacheSet(this.userEmailKey(updated.email), CachedUsersMapper.toPersistence(updated))
    return updated
  }

  async delete (userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) return
    await this.usersRepository.delete(userId)
    await this.cacheDelete(this.userKey(user.id))
    await this.cacheDelete(this.userEmailKey(user.email))
  }

  async findById (userId: string): Promise<User | null> {
    const cached = await this.cacheGet(this.userKey(userId))
    if (cached) {
      try {
        return CachedUsersMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.userKey(userId))
      }
    }
    const user = await this.usersRepository.findById(userId)
    if (user) {
      await this.cacheSet(this.userKey(user.id), CachedUsersMapper.toPersistence(user))
      await this.cacheSet(this.userEmailKey(user.email), CachedUsersMapper.toPersistence(user))
    }
    return user
  }

  async findByEmail (email: string): Promise<User | null> {
    const cached = await this.cacheGet(this.userEmailKey(email))
    if (cached) {
      try {
        return CachedUsersMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.userEmailKey(email))
      }
    }
    const user = await this.usersRepository.findByEmail(email)
    if (user) {
      await this.cacheSet(this.userKey(user.id), CachedUsersMapper.toPersistence(user))
      await this.cacheSet(this.userEmailKey(user.email), CachedUsersMapper.toPersistence(user))
    }
    return user
  }

  async findMany (params: PaginationParams): Promise<PaginatedUsers> {
    const key = this.usersPaginationKey(params)
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedUsersMapper.toPaginatedDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }
    const users = await this.usersRepository.findMany(params)
    await this.cacheSet(key, CachedUsersMapper.toPaginatedPersistence(users))
    return users
  }

  private emailKey (prefix: string, email: string): string {
    return `${prefix}:email:${email}`
  }

  private paginationKey (prefix: string, params: PaginationParams): string {
    const order = params.order ?? 'desc'
    return `${prefix}:pagination:page=${params.page}:size=${params.pageSize}:order=${order}`
  }
}
