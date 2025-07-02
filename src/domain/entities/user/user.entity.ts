import { Entity } from '@/core/domain/entity'
import type { UserProps } from './ports/user.props'

export class User extends Entity {
  readonly name: string
  readonly email: string
  readonly password: string

  private constructor (props: UserProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: UserProps): User {
    const { name, email, password } = props
    return new User({ name, email, password })
  }
}
