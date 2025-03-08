import type { User } from '../user.mapper'
import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'

export type UserProps = OmitIdAndTimestamps<User>
