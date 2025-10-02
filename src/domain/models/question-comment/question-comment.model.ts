import { Comment } from '../comment/comment.model'

export class QuestionComment extends Comment {
  constructor (
    readonly authorId: string,
    readonly content: string,
    readonly questionId: string,
    id?: string
  ) {
    super(authorId, content, id)
  }
}
