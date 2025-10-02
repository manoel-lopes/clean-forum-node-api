import { Comment } from '../comment/comment.model'

export class AnswerComment extends Comment {
  constructor (
    readonly authorId: string,
    readonly content: string,
    readonly answerId: string,
    id?: string
  ) {
    super(authorId, content, id)
  }
}
