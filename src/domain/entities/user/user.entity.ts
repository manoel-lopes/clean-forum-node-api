import { Entity } from '@/core/domain/entity'
import type { UserProps } from './ports/user.props'

export class User extends Entity {
  private constructor (
    readonly name: string,
    readonly email: string,
    readonly password: string
  ) {
    super()
  }

  static create (props: UserProps): User {
    const { name, email, password } = data
    return new User(name, email, password)
  }
}
