import { User } from '@/domain/entities/user/user.entity'
import { faker } from '@faker-js/faker'

export function makeUser (override: Partial<User> = {}): User {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  })
  return user
}
