import { User } from '@domain/entities/user/user.entity'

export interface UsersRepository {
  create(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  delete(id: string): Promise<void>
}
