import type { User } from '../user.entity'
import type { Optional } from '@/shared/types/common/optional'

export type UserProps = Optional<Omit<User, 'id'>, 'createdAt' | 'updatedAt'>
