import { User } from '@/infra/persistence/typeorm/data-mappers/user/user.mapper'

export function makeUser (override?: Partial<User>): User {
  const baseUser = User.create({
    name: 'any_user_name',
    email: 'any_user_email',
    password: 'any_user_password',
  })

  return { ...baseUser, ...override }
}
