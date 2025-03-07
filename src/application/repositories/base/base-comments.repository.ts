export type UpdateCommentData = {
  id: string
  content?: string
}

export type BaseCommentsRepository = {
  delete(commentId: string): Promise<void>
}
