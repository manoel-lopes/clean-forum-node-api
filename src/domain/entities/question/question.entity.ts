import { Entity } from '@/core/domain/entity'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import type { QuestionProps } from './ports/question.props'

export class Question extends Entity {
  readonly authorId: string
  readonly title: string
  readonly content: string
  readonly slug: string
  readonly bestAnswerId?: string

  private constructor (props: QuestionProps & { slug: string }) {
    super()
    Object.assign(this, props)
  }

  static create (props: QuestionProps) {
    const { title, content, authorId, bestAnswerId } = props
    const slug = Slug.create(props.title)
    return new Question({
      title,
      content,
      authorId,
      slug: slug.value,
      bestAnswerId
    })
  }
}
