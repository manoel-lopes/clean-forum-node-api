import { User } from '@/domain/entities/user/user.entity'
import { faker } from '@faker-js/faker'

export function makeUser (override?: Partial<User>): User {
  const baseUser = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })
  return { ...baseUser, ...override }
}
