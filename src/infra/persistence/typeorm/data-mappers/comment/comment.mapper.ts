import { Column } from 'typeorm'
import { BaseDataMapper } from '../base/base-data-mapper'

export abstract class Comment extends BaseDataMapper {
  @Column({ type: 'varchar' })
  readonly content: string

  @Column({ name: 'author_id', type: 'uuid' })
  readonly authorId: string
}
