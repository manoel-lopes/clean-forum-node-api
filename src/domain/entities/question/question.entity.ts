import { Entity } from '@/core/domain/entity'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import type { Answer } from '../answer/answer.entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type QuestionProps = Optional<Omit<Props<typeof Question>, 'slug' | 'answers'>, 'bestAnswerId'>

export class Question extends Entity {
  readonly authorId: string
  readonly title: string
  readonly content: string
  readonly slug: string
  readonly bestAnswerId: string | null = null
  answers: Answer[] = []

  private constructor (props: QuestionProps & { slug: string }, id?: string) {
    super(id)
    Object.assign(this, props)
  }

  static create (props: QuestionProps, id?: string): Question {
    const slug = Slug.create(props.title)
    return new Question({
      ...props,
      slug: slug.value
    }, id)
  }
}
