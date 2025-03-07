import { User } from './user.entity'

describe('User', () => {
  it('should create a user', () => {
    const user = User.create({
      name: 'any_user_name',
      email: 'any_user_email',
      password: 'any_user_password',
    })

    expect(user.id).toBeDefined()
    expect(user.name).toBe('any_user_name')
    expect(user.email).toBe('any_user_email')
    expect(user.password).toBe('any_user_password')
  })
})
