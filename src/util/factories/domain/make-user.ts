import { User } from '@/domain/entities/user/user.entity'

export function makeUser (override?: Partial<User>): User {
  const baseUser = User.create({
    name: 'any_user_name',
    email: 'any_user_email',
    password: 'any_user_password',
  })

  return { ...baseUser, ...override }
}
