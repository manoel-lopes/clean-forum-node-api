import { Entity } from '@/core/domain/entity'
import type { UserProps } from './ports/user.props'

export class User extends Entity {
  readonly name: string
  readonly email: string
  readonly password: string

  private constructor (props: UserProps, id?: string) {
    super(id)
    Object.assign(this, props)
  }

  static create (props: UserProps, id?: string): User {
    return new User(props, id)
  }
}
