import { Entity } from '@/core/domain/entity'

export class User extends Entity {
  constructor (
    readonly name: string,
    readonly email: string,
    readonly password: string,
    id?: string
  ) {
    super(id)
  }
}
