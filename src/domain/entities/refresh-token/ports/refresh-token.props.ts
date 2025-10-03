import type { RefreshToken } from '../refresh-token.entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type RefreshTokenProps = Optional<Props<typeof RefreshToken>, 'expiresAt'>
