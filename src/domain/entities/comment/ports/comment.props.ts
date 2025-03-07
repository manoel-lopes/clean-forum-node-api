import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import { Comment } from '../comment.entity'

export type CommentProps = OmitIdAndTimestamps<Comment>
