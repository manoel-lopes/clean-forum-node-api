import { ZodType } from 'zod'

import { questionSchema } from '@/external/zod/domain/question.schema'

import { Entity } from '@/core/domain/entity'

import { Slug } from '@/domain/value-objects/slug/slug.vo'

import type { QuestionProps } from './ports/question.props'

export class Question extends Entity {
  // eslint-disable-next-line no-use-before-define
  static readonly schema: ZodType<Question> = questionSchema
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
