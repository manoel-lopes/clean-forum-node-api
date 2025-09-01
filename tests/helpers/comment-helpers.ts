import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export interface EditCommentData {
  content: string
}

export interface EditCommentFlexibleData {
  content?: unknown
}

export async function deleteQuestionComment (app: FastifyInstance, token: string, commentId: string) {
  return request(app.server)
    .delete(`/question-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function deleteAnswerComment (app: FastifyInstance, token: string, commentId: string) {
  return request(app.server)
    .delete(`/answer-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function editQuestionComment (app: FastifyInstance, token: string, commentId: string, commentData: EditCommentData | EditCommentFlexibleData) {
  return request(app.server)
    .put(`/question-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function editAnswerComment (app: FastifyInstance, token: string, commentId: string, commentData: EditCommentData | EditCommentFlexibleData) {
  return request(app.server)
    .put(`/answer-comments/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function fetchQuestionComments (app: FastifyInstance, token: string, questionId: string, options?: { page?: number, perPage?: number }) {
  const queryParams = options ? `?page=${options.page}&perPage=${options.perPage}` : ''
  return request(app.server)
    .get(`/questions/${questionId}/comments${queryParams}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function fetchAnswerComments (app: FastifyInstance, token: string, answerId: string, options?: { page?: number, perPage?: number }) {
  const queryParams = options ? `?page=${options.page}&perPage=${options.perPage}` : ''
  return request(app.server)
    .get(`/answers/${answerId}/comments${queryParams}`)
    .set('Authorization', `Bearer ${token}`)
}
