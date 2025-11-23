import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type CreateAnswerCommentData = {
  answerId?: unknown
  content?: unknown
}

export async function commentOnAnswer (app: FastifyInstance, token: string, commentData: CreateAnswerCommentData) {
  return await request(app.server)
    .post(`/answers/${commentData.answerId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}
