import type { UpdateUserData, UsersRepository } from '@/application/repositories/users.repository'
import type { User } from '@/infra/persistence/typeorm/data-mappers/user/user.mapper'
import type { CacheService } from '@/infra/providers/cache/ports/cache-service'
import { parseUsers } from './helpers/parse-users'

export class CacheUsersRepository implements UsersRepository {
  constructor (
    private readonly userRepository: UsersRepository,
    private readonly cacheService: CacheService
  ) {}

  async save (user: User): Promise<void> {
    await this.userRepository.save(user)
    const users = await this.cacheService.get('users')
    const parsedUsers = parseUsers(users || '')
    const updatedUsers = [...parsedUsers, user]
    await this.cacheService.delete('users')
    await this.cacheService.set('users', JSON.stringify(updatedUsers))
  }

  async findById (userId: string): Promise<User | null> {
    const users = await this.cacheService.get('users')
    if (!users) {
      return null
    }

    const parsedUsers = parseUsers(users)
    let user = parsedUsers.find((user: User) => user.id === userId) || null
    if (!user) {
      user = await this.userRepository.findById(userId)
    }

    const updatedUsers = [...parsedUsers, user]
    await this.cacheService.delete('users')
    await this.cacheService.set('users', JSON.stringify(updatedUsers))
    return user
  }

  async findByEmail (userEmail: string): Promise<User | null> {
    const users = await this.cacheService.get('users')
    if (!users) {
      return null
    }

    const parsedUsers = parseUsers(users)
    let user = parsedUsers.find((user: User) => user.email === userEmail) || null
    if (!user) {
      user = await this.userRepository.findByEmail(userEmail)
    }

    const updatedUsers = [...parsedUsers, user]
    await this.cacheService.delete('users')
    await this.cacheService.set('users', JSON.stringify(updatedUsers))
    return user
  }

  async delete (userId: string): Promise<void> {
    await this.userRepository.delete(userId)
    const users = await this.cacheService.get('users')
    const parsedUsers = parseUsers(users || '')
    const updatedUsers = parsedUsers.filter((user: User) => user.id !== userId)
    await this.cacheService.delete('users')
    await this.cacheService.set('users', JSON.stringify(updatedUsers))
  }

  async update (data: UpdateUserData): Promise<User> {
    const updatedUser = await this.userRepository.update(data)
    const users = await this.cacheService.get('users')
    const parsedUsers = parseUsers(users || '')
    const updatedUsers = parsedUsers.map((user) => user.id === updatedUser.id ? updatedUser : user)
    await this.cacheService.delete('users')
    await this.cacheService.set('users', JSON.stringify(updatedUsers))
    return updatedUser
  }
}
