import type {
  UsersRepository,
  UpdateUserData,
} from '@/application/repositories/users.repository'
import type { User } from '@/domain/entities/user/user.entity'
import {
  BaseInMemoryRepository as BaseRepository,
} from './base/base-in-memory.repository'

export class InMemoryUsersRepository extends BaseRepository<User> implements UsersRepository {
  async update (userData: UpdateUserData): Promise<User> {
    const updatedUser = await this.updateOne(userData)
    return updatedUser
  }

  async delete (userId: string): Promise<void> {
    await this.deleteOneBy('id', userId)
  }

  async findById (userId: string): Promise<User | null> {
    const user = await this.findOneBy('id', userId)
    return user
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.findOneBy('email', email)
    return user
  }
}
