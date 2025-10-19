import { uuidv7 } from 'uuidv7'
import type {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/enterprise/entities/question-attachment.entity'

export function makeQuestionAttachment (overrides: Partial<QuestionAttachmentProps> = {}): QuestionAttachment {
  return {
    id: uuidv7(),
    title: 'any-title',
    link: 'https://example.com/file.pdf',
    questionId: uuidv7(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
