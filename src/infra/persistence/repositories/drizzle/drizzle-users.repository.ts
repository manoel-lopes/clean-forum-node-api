import { eq } from 'drizzle-orm'
import type { User } from '@/domain/entities/user/user.entity'
import type { UpdateUserData, UsersRepository } from '@/application/repositories/users.repository'
import {
  BaseDrizzleRepository as BaseRepository
} from './base/base-drizzle.repository'
import { db } from '@/infra/persistence/drizzle/client'
import { users } from '@/infra/persistence/drizzle/schemas/users.schema'

export class DrizzleUsersRepository extends BaseRepository<typeof users> implements UsersRepository {
  constructor () {
    super(users)
  }

  async findById (userId: string): Promise<User | null> {
    const user = await this.findOne({ where: { id: userId } })
    return user
  }

  async delete (userId: string): Promise<void> {
    await this.deleteOne({ where: { id: userId } })
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.findOne({ where: { email } })
    return user
  }

  async update (data: UpdateUserData): Promise<User> {
    const { id, ...rest } = data
    const [user] = await db.update(users)
      .set(rest)
      .where(eq(users.id, id))
      .returning()
    return user
  }
}
