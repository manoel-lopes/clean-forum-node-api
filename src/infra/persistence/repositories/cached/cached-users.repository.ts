import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  PaginatedUsers,
  UpdateUserData,
  UsersRepository
} from '@/domain/application/repositories/users.repository'
import { CachedUsersMapper } from '@/infra/persistence/mappers/cached/cached-users.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { User } from '@/domain/enterprise/entities/user.entity'

export class CachedUsersRepository implements UsersRepository {
  private readonly keyPrefix = 'users'

  constructor (
    private readonly redis: RedisService,
    private readonly usersRepository: UsersRepository
  ) {}

  async create (user: User): Promise<void> {
    await this.usersRepository.create(user)
    await this.cacheUser(user)
  }

  async update (userData: UpdateUserData): Promise<User> {
    const updated = await this.usersRepository.update(userData)
    await this.cacheUser(updated)
    return updated
  }

  async delete (userId: string): Promise<void> {
    await this.usersRepository.delete(userId)
    await this.redis.delete(this.userKey(userId))
  }

  async findById (userId: string): Promise<User | null> {
    const cached = await this.redis.get(this.userKey(userId), CachedUsersMapper.toDomain)
    if (cached) return cached
    const user = await this.usersRepository.findById(userId)
    if (user) {
      await this.cacheUser(user)
    }
    return user
  }

  async findByEmail (email: string): Promise<User | null> {
    const cached = await this.redis.get(this.userEmailKey(email), CachedUsersMapper.toDomain)
    if (cached) return cached
    const user = await this.usersRepository.findByEmail(email)
    if (user) {
      await this.cacheUser(user)
    }
    return user
  }

  async findMany (params: PaginationParams): Promise<PaginatedUsers> {
    const key = this.redis.listKey(this.keyPrefix, params)
    const cached = await this.redis.get(key, CachedUsersMapper.toPaginatedDomain)
    if (cached) return cached
    const users = await this.usersRepository.findMany(params)
    await this.redis.set(key, CachedUsersMapper.toPaginatedPersistence(users))
    return users
  }

  private userKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private userEmailKey (email: string): string {
    return `${this.keyPrefix}:email:${email}`
  }

  private async cacheUser (user: User): Promise<void> {
    const userData = CachedUsersMapper.toPersistence(user)
    await this.redis.set(this.userKey(user.id), userData)
    await this.redis.set(this.userEmailKey(user.email), userData)
  }
}
