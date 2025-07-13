import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import type { User } from '../user.entity'

export type UserProps = OmitIdAndTimestamps<User>
