import { Entity } from '@/core/domain/entity'

import type { AnswerProps } from './ports/answer.props'

export class Answer extends Entity {
  readonly content: string
  readonly questionId: string
  readonly authorId: string

  private constructor (props: AnswerProps, id?: string) {
    super(id)
    Object.assign(this, props)
  }

  get excerpt () {
    return this.content.substring(0, 45).replace(/ $/, '').concat('...')
  }

  static create (props: AnswerProps, id?: string): Answer {
    const { content, questionId, authorId } = props
    return new Answer({ content, questionId, authorId }, id)
  }
}
