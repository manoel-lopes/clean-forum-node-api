import { faker } from '@faker-js/faker'

import { User } from '@/domain/entities/user/user.entity'

export function makeUser (override?: Partial<User>): User {
  const baseUser = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

  return { ...baseUser, ...override }
}
