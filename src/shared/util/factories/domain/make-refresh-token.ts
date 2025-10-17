import { uuidv7 } from 'uuidv7'
import type { RefreshToken } from '@/domain/enterprise/entities/refresh-token.entity'
import { faker } from '@faker-js/faker'

export function makeRefreshToken(override: Partial<RefreshToken> = {}): RefreshToken {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days
  const refreshToken: RefreshToken = {
    id: uuidv7(),
    userId: faker.string.uuid(),
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return Object.assign(refreshToken, override)
}
