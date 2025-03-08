import { Entity } from '@/core/domain/entity'
import { Column } from 'typeorm'

export type CommentProps = {
  authorId: string
  content: string
}

export abstract class Comment<Props> extends Entity<Props> {
  @Column({ name: 'author_id', type: 'uuid' })
  readonly authorId: string

  @Column({ type: 'varchar' })
  readonly content: string

  @Column({ name: 'question_id', type: 'uuid', nullable: true })
  protected readonly questionId?: string

  @Column({ name: 'answer_id', type: 'uuid', nullable: true })
  protected readonly answerId?: string
}
