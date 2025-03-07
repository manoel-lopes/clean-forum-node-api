import { Entity } from '@/core/domain/entity'
import type { AnswerProps } from './ports/answer.props'

export class Answer extends Entity {
  private constructor (
    readonly content: string,
    readonly questionId: string,
    readonly authorId: string
  ) {
    super()
  }

  get excerpt () {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  static create (data: AnswerProps) {
    const { content, questionId, authorId } = data
    return new Answer(content, questionId, authorId)
  }
}
