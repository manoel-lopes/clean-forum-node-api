import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type CreateQuestionAttachmentData = {
  questionId: unknown
  title: unknown
  url: unknown
}

export type UpdateQuestionAttachmentData = {
  attachmentId: unknown
  title?: unknown
  url?: unknown
}

export async function createQuestionAttachment (
  app: FastifyInstance,
  token: string,
  attachmentData: CreateQuestionAttachmentData
) {
  return request(app.server)
    .post(`/questions/${attachmentData.questionId}/attachments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: attachmentData.title,
      url: attachmentData.url,
    })
}

export async function updateQuestionAttachment (
  app: FastifyInstance,
  token: string | undefined,
  updateData: UpdateQuestionAttachmentData
) {
  const req = request(app.server).patch(`/questions/attachments/${updateData.attachmentId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: updateData.title,
    url: updateData.url,
  })
}

export async function deleteQuestionAttachment (app: FastifyInstance, token: string, attachmentId: unknown) {
  return request(app.server).delete(`/questions/attachments/${attachmentId}`).set('Authorization', `Bearer ${token}`)
}

export async function attachToQuestion (
  app: FastifyInstance,
  token: string | undefined,
  attachmentData: { questionId: unknown; title?: unknown; url?: unknown }
) {
  const req = request(app.server).post(`/questions/${attachmentData.questionId}/attachments`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: attachmentData.title,
    url: attachmentData.url,
  })
}
