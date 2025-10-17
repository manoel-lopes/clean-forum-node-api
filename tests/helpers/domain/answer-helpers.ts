import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type CreateAnswerData = {
  questionId?: unknown
  content?: unknown
}

export type CreateAnswerCommentData = {
  answerId?: unknown
  content?: unknown
}

export async function createAnswer(app: FastifyInstance, token: string, answerData: CreateAnswerData) {
  return await request(app.server).post('/answers').set('Authorization', `Bearer ${token}`).send(answerData)
}

export async function deleteAnswer(
  app: FastifyInstance,
  token: string,
  {
    answerId,
  }: {
    answerId: string
  },
) {
  return await request(app.server).delete(`/answers/${answerId}`).set('Authorization', `Bearer ${token}`)
}

export async function commentOnAnswer(app: FastifyInstance, token: string, commentData: CreateAnswerCommentData) {
  return await request(app.server)
    .post(`/answers/${commentData.answerId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}
