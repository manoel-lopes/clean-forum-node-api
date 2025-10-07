import type { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'

export type RefreshTokenProps = Props<RefreshToken>

export type RefreshToken = Entity & {
  userId: string
  expiresAt: Date
}
