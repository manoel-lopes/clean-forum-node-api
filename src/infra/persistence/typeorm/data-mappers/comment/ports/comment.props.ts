import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import { Comment } from '../comment.mapper'

export type CommentProps = OmitIdAndTimestamps<Comment>
