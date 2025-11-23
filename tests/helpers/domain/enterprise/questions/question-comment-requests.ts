import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type CreateQuestionCommentData = {
  questionId?: unknown
  content?: unknown
}

export async function commentOnQuestion (app: FastifyInstance, token: string, commentData: CreateQuestionCommentData) {
  return await request(app.server)
    .post(`/questions/${commentData.questionId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}
