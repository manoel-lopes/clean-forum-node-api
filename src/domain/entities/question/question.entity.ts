import { Entity } from '@/core/domain/entity'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import type { QuestionProps } from './ports/question.props'

export class Question extends Entity {
  private constructor (
    readonly authorId: string,
    readonly title: string,
    readonly content: string,
    readonly slug: string,
    readonly bestAnswerId: string | null = null
  ) {
    super()
  }

  static create (data: QuestionProps) {
    const slug = Slug.create(data.title)
    return new Question(
      data.authorId,
      data.title,
      data.content,
      slug.value,
      data.bestAnswerId
    )
  }
}
