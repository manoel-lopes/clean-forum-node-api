import type { RefreshToken } from '../refresh-token.entity'
import type { Optional } from '@/shared/types/common/optional'

export type RefreshTokenProps = Optional<Omit<RefreshToken, 'id'>, 'createdAt' | 'updatedAt' | 'expiresAt'>
