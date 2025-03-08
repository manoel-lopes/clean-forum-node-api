import type { User } from '@/infra/persistence/typeorm/data-mappers/user/user.mapper'
import type { Optional } from '@/util/types/optional'

export type UpdateUserData = Optional<User, 'name' | 'email' | 'password' | 'createdAt' | 'updatedAt'>

export type UsersRepository = {
  save: (user: User) => Promise<void>
  findById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
  findByEmail(email: string): Promise<User | null>
  update(data: UpdateUserData): Promise<User>
}
