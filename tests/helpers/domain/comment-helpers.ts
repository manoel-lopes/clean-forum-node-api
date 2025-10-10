import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import type { PaginationParams } from '@/core/domain/application/pagination-params'

export type UpdateCommentData = {
  content?: unknown
}

export async function deleteQuestionComment (app: FastifyInstance, token: string, {
  commentId
}: {
  commentId: string
}) {
  return request(app.server)
    .delete(`/comments/question-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function deleteAnswerComment (app: FastifyInstance, token: string, {
  commentId
}: {
  commentId: string
}) {
  return request(app.server)
    .delete(`/comments/answer-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function updateQuestionComment (app: FastifyInstance, token: string, {
  commentId
}: {
  commentId: string
}, commentData: UpdateCommentData) {
  return request(app.server)
    .put(`/comments/question-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function updateAnswerComment (app: FastifyInstance, token: string, {
  commentId
}: {
  commentId: string
}, commentData: UpdateCommentData) {
  return request(app.server)
    .put(`/comments/answer-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function fetchQuestionComments (app: FastifyInstance, token: string, {
  questionId
}: {
  questionId: string
}, params?: PaginationParams) {
  const queryParams = params ? `?page=${params.page}&pageSize=${params.pageSize}` : ''
  return request(app.server)
    .get(`/questions/${questionId}/comments${queryParams}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function fetchAnswerComments (app: FastifyInstance, token: string,
  {
    answerId
  }: {
    answerId: string
  }, params?: PaginationParams) {
  const queryParams = params ? `?page=${params.page}&pageSize=${params.pageSize}` : ''
  return request(app.server)
    .get(`/answers/${answerId}/comments${queryParams}`)
    .set('Authorization', `Bearer ${token}`)
}
