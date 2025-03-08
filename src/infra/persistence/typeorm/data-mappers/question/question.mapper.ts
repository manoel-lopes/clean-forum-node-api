import { Entity, Column } from 'typeorm'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { BaseDataMapper } from '../base/base-data-mapper'
import type { QuestionProps } from './ports/question.props'

@Entity({ name: 'questions' })
export class Question extends BaseDataMapper {
  @Column({ name: 'author_id', type: 'uuid' })
  readonly authorId: string

  @Column({ type: 'varchar' })
  readonly title: string

  @Column({ type: 'varchar' })
  readonly content: string

  @Column({ type: 'varchar' })
  readonly slug: string

  @Column({ name: 'best_answer_id', type: 'uuid', nullable: true })
  readonly bestAnswerId?: string

  private constructor (props: QuestionProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: Omit<QuestionProps, 'slug'>): Question {
    const slug = Slug.create(props.title)
    return new Question({
      authorId: props.authorId,
      title: props.title,
      content: props.content,
      slug: slug.value,
      bestAnswerId: props.bestAnswerId
    })
  }
}
