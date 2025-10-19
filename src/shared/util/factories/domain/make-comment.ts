import { uuidv7 } from 'uuidv7'
import type { Comment } from '@/domain/enterprise/entities/base/comment.entity'
import { faker } from '@faker-js/faker'

export function makeComment (override: Partial<Comment> = {}): Comment {
  const comment: Comment = {
    id: uuidv7(),
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return Object.assign(comment, override)
}
