import { uuidv7 } from 'uuidv7'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'
import { faker } from '@faker-js/faker'

export function makeAnswer (override: Partial<Answer> = {}): Answer {
  const content = faker.lorem.paragraphs()
  const excerpt = content.length > 45
    ? content.substring(0, 45).trimEnd() + '...'
    : content + '...'
  const answer: Answer = {
    id: uuidv7(),
    content,
    excerpt,
    authorId: faker.string.uuid(),
    questionId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return Object.assign(answer, override)
}
