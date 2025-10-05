import { uuidv7 } from 'uuidv7'
import { RefreshToken } from './refresh-token.entity'

describe('RefreshToken', () => {
  it('should create a refresh token', () => {
    const refreshToken = RefreshToken.create({
      userId: uuidv7()
    })

    expect(refreshToken.userId).toBeDefined()
    expect(refreshToken.id).toBeDefined()
    expect(refreshToken.createdAt).toBeInstanceOf(Date)
    expect(refreshToken.expiresAt).toBeInstanceOf(Date)
  })

  it('should recreate a refresh token from existing data', () => {
    const existingId = uuidv7()
    const userId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')

    const refreshToken = RefreshToken.create({
      userId,
      createdAt
    }, existingId)

    expect(refreshToken.id).toBe(existingId)
    expect(refreshToken.userId).toBe(userId)
    expect(refreshToken.createdAt).toBe(createdAt)
  })

  describe('expiresAt calculation', () => {
    it('should automatically calculate expiresAt as 7 days from now', () => {
      const beforeCreate = new Date()

      const refreshToken = RefreshToken.create({
        userId: uuidv7()
      })

      const afterCreate = new Date()
      const expectedMinExpiration = new Date(beforeCreate.getTime() + 7 * 24 * 60 * 60 * 1000)
      const expectedMaxExpiration = new Date(afterCreate.getTime() + 7 * 24 * 60 * 60 * 1000)

      expect(refreshToken.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiration.getTime())
      expect(refreshToken.expiresAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiration.getTime())
    })
  })
})
