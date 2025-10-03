import type { Optional } from '@/shared/types/common/optional'
import type { RefreshToken } from '../refresh-token.entity'

export type RefreshTokenProps = Optional<Omit<RefreshToken, 'id'>, 'createdAt' | 'updatedAt' | 'expiresAt'>
