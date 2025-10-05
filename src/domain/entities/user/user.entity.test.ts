import { uuidv7 } from 'uuidv7'
import { User } from './user.entity'

describe('User', () => {
  it('should create a user', () => {
    const user = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password'
    })

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.password).toBe('hashed-password')
    expect(user.id).toBeDefined()
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it('should recreate a user from existing data', () => {
    const existingId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')
    const updatedAt = new Date('2024-01-02T15:30:00.000Z')

    const user = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt,
      updatedAt
    }, existingId)

    expect(user.id).toBe(existingId)
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.password).toBe('hashed-password')
    expect(user.createdAt).toBe(createdAt)
    expect(user.updatedAt).toBe(updatedAt)
  })
})
