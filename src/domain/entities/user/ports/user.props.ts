import type { Optional } from '@/util/types/optional'
import type { User } from '../user.entity'

export type UserProps = Optional<Omit<User, 'id'>, 'createdAt' | 'updatedAt'>
