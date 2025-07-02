import { User } from '@domain/entities/user/user.entity'
import { UsersRepository } from '@application/repositories/users.repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  public async create(user: User): Promise<void> {
    this.items.push(user)
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }
}