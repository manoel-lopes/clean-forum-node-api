import { uuidv7 } from 'uuidv7'
import type { AnswerAttachment, AnswerAttachmentProps } from '@/domain/enterprise/entities/answer-attachment.entity'

export function makeAnswerAttachment(overrides: Partial<AnswerAttachmentProps> = {}): AnswerAttachment {
  return {
    id: uuidv7(),
    title: 'any-title',
    link: 'https://example.com/file.pdf',
    answerId: uuidv7(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
