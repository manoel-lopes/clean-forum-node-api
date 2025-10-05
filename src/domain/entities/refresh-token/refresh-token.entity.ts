import { Entity } from '@/core/domain/entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type RefreshTokenProps = Optional<Props<typeof RefreshToken>, 'expiresAt'>

export class RefreshToken extends Entity {
  readonly userId: string
  readonly expiresAt: Date

  private constructor (props: RefreshTokenProps & { expiresAt: Date }, id?: string) {
    super(id)
    Object.assign(this, props)
  }

  static create (props: RefreshTokenProps, id?: string): RefreshToken {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return new RefreshToken({ ...props, expiresAt }, id)
  }
}
