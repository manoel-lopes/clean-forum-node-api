import { describe, expect, it } from 'vitest'
import { User } from './user.entity'

describe('User', () => {
  describe('create', () => {
    it('should be able to recreate a user from existing data with id', () => {
      const existingId = 'existing-user-id'

      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password'
      }, existingId)

      expect(user.id).toBe(existingId)
      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
      expect(user.password).toBe('hashed-password')
    })
  })
})
