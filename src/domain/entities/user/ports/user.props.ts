import type { User } from '../user.entity'
import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'

export type UserProps = OmitIdAndTimestamps<User>
