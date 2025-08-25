import type { Optional } from '@/util/types/optional'
import type { RefreshToken } from '../refresh-token.entity'

export type RefreshTokenProps = Optional<Omit<RefreshToken, 'id'>, 'createdAt' | 'updatedAt' | 'expiresAt'>
