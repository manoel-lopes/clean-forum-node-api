import { User } from '@/domain/models/user/user.model'
import { faker } from '@faker-js/faker'

export function makeUser (override: Partial<User> = {}): User {
  const user = new User(
    override.name ?? faker.person.fullName(),
    override.email ?? faker.internet.email(),
    override.password ?? faker.internet.password(),
    override.id
  )

  if (override.createdAt || override.updatedAt) {
    Object.assign(user, {
      createdAt: override.createdAt ?? user.createdAt,
      updatedAt: override.updatedAt ?? user.updatedAt
    })
  }
  return user
}
