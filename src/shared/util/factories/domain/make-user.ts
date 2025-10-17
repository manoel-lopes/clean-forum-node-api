import { uuidv7 } from 'uuidv7'
import type { User } from '@/domain/enterprise/entities/user.entity'
import { faker } from '@faker-js/faker'

export function makeUser(override: Partial<User> = {}): User {
  const user: User = {
    id: uuidv7(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  }
  return user
}
