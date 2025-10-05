import { describe, expect, it } from 'vitest'
import { RefreshToken } from './refresh-token.entity'

describe('RefreshToken', () => {
  describe('create', () => {
    it('should be able to recreate a refresh token from existing data with id', () => {
      const existingId = 'existing-token-id'

      const refreshToken = RefreshToken.create({
        userId: 'user-id'
      }, existingId)

      expect(refreshToken.id).toBe(existingId)
      expect(refreshToken.userId).toBe('user-id')
    })

    it('should automatically calculate expiresAt as 7 days from now', () => {
      const beforeCreate = new Date()
      const refreshToken = RefreshToken.create({
        userId: 'user-id'
      })
      const afterCreate = new Date()

      const expectedMinExpiration = new Date(beforeCreate.getTime() + 7 * 24 * 60 * 60 * 1000)
      const expectedMaxExpiration = new Date(afterCreate.getTime() + 7 * 24 * 60 * 60 * 1000)

      expect(refreshToken.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiration.getTime())
      expect(refreshToken.expiresAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiration.getTime())
    })
  })
})
