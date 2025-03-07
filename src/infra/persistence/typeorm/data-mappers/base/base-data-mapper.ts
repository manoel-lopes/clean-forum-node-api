import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { uuidv7 } from 'uuidv7'

export abstract class BaseDataMapper {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string = uuidv7()

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'NOW()'
  })
  readonly createdAt = new Date()

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'NULL',
    onUpdate: 'NOW()'
  })
  readonly updatedAt? = new Date()
}
