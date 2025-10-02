import { Entity } from '@/core/domain/entity'

export class Answer extends Entity {
  constructor (
    readonly content: string,
    readonly questionId: string,
    readonly authorId: string,
    id?: string
  ) {
    super(id)
  }

  get excerpt (): string {
    return this.content.substring(0, 45).replace(/ $/, '').concat('...')
  }
}
