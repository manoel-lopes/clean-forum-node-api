import { Comment } from '@/domain/entities/comment/comment.entity'
import { faker } from '@faker-js/faker'

export function makeComment (override: Partial<Comment> = {}): Comment {
  const comment = {
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }
  return Object.assign(comment, override)
}
