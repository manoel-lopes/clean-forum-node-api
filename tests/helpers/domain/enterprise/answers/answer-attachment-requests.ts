import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type CreateAnswerAttachmentData = {
  answerId: unknown
  title: unknown
  url: unknown
}

export type UpdateAnswerAttachmentData = {
  attachmentId: unknown
  title?: unknown
  url?: unknown
}

export async function createAnswerAttachment (
  app: FastifyInstance,
  token: string,
  attachmentData: CreateAnswerAttachmentData
) {
  return request(app.server)
    .post(`/answers/${attachmentData.answerId}/attachments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: attachmentData.title,
      url: attachmentData.url,
    })
}

export async function updateAnswerAttachment (
  app: FastifyInstance,
  token: string | undefined,
  updateData: UpdateAnswerAttachmentData
) {
  const req = request(app.server).patch(`/answers/attachments/${updateData.attachmentId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: updateData.title,
    url: updateData.url,
  })
}

export async function deleteAnswerAttachment (app: FastifyInstance, token: string, attachmentId: unknown) {
  return request(app.server).delete(`/answers/attachments/${attachmentId}`).set('Authorization', `Bearer ${token}`)
}

export async function attachToAnswer (
  app: FastifyInstance,
  token: string | undefined,
  attachmentData: { answerId: unknown; title?: unknown; url?: unknown }
) {
  const req = request(app.server).post(`/answers/${attachmentData.answerId}/attachments`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: attachmentData.title,
    url: attachmentData.url,
  })
}
