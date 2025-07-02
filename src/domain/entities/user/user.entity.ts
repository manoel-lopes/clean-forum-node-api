import { Entity } from '@core/domain/entity'
import { UserProps } from './ports/user.props'
import { randomUUID } from 'node:crypto'

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id)
  }

  public static create(props: UserProps, id?: string): User {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    if (!id) {
      user.id = randomUUID()
    }

    return user
  }

  public get name(): string {
    return this.props.name
  }

  public set name(name: string) {
    this.props.name = name
  }

  public get email(): string {
    return this.props.email
  }

  public set email(email: string) {
    this.props.email = email
  }

  public get password(): string {
    return this.props.password
  }

  public set password(password: string) {
    this.props.password = password
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  public set updatedAt(updatedAt: Date | undefined) {
    this.props.updatedAt = updatedAt
  }
}
