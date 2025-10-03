import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'
import { faker } from '@faker-js/faker'

export function makeRefreshToken (override: Partial<RefreshToken> = {}): RefreshToken {
  const refreshToken = RefreshToken.create({
    userId: faker.string.uuid()
  })
  return Object.assign(refreshToken, override)
}
