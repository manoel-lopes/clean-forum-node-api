import { Comment } from '../comment.entity'
import type { Optional } from '@/shared/types/common/optional'

export type CommentProps = Optional<Omit<Comment, 'id'>, 'createdAt' | 'updatedAt'>
