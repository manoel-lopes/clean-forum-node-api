import type { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'

export type UserProps = Props<User>

export type User = Entity & {
  name: string
  email: string
  password: string
}
