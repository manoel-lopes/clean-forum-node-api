import type { Optional } from '@/util/types/optional'
import { Comment } from '../comment.entity'

export type CommentProps = Optional<Omit<Comment, 'id'>, 'createdAt' | 'updatedAt'>
