import { Column } from 'typeorm'
import { BaseDataMapper } from '../base/base-data-mapper'
import type { UserProps } from './ports/user.props'

export class User extends BaseDataMapper {
  @Column({ type: 'varchar' })
  readonly name: string

  @Column({ type: 'varchar', unique: true })
  readonly email: string

  @Column({ type: 'varchar' })
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
