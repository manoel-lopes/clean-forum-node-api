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

export type UpdateAnswerData = {
  answerId: unknown
  content?: unknown
}

export type CreateAnswerAttachmentData = {
  answerId: unknown
  title: unknown
  link: unknown
}

export type UpdateAnswerAttachmentData = {
  attachmentId: unknown
  title?: unknown
  link?: unknown
}

export type FetchAnswerAttachmentsData = {
  answerId: unknown
  page?: unknown
  pageSize?: unknown
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
    answerId: unknown
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

export async function updateAnswer(app: FastifyInstance, token: string | undefined, updateData: UpdateAnswerData) {
  const req = request(app.server).patch(`/answers/${updateData.answerId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    content: updateData.content,
  })
}

export async function createAnswerAttachment(
  app: FastifyInstance,
  token: string,
  attachmentData: CreateAnswerAttachmentData,
) {
  return request(app.server)
    .post(`/answers/${attachmentData.answerId}/attachments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: attachmentData.title,
      link: attachmentData.link,
    })
}

export async function updateAnswerAttachment(
  app: FastifyInstance,
  token: string | undefined,
  updateData: UpdateAnswerAttachmentData,
) {
  const req = request(app.server).patch(`/answers/attachments/${updateData.attachmentId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: updateData.title,
    link: updateData.link,
  })
}

export async function fetchAnswerAttachments(
  app: FastifyInstance,
  token: string,
  fetchData: FetchAnswerAttachmentsData,
) {
  const params = new URLSearchParams()
  if (fetchData.page) params.append('page', String(fetchData.page))
  if (fetchData.pageSize) params.append('pageSize', String(fetchData.pageSize))
  const query = params.toString() ? `?${params.toString()}` : ''
  return request(app.server)
    .get(`/answers/${fetchData.answerId}/attachments${query}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function deleteAnswerAttachment(app: FastifyInstance, token: string, attachmentId: unknown) {
  return request(app.server).delete(`/answers/attachments/${attachmentId}`).set('Authorization', `Bearer ${token}`)
}

export async function attachToAnswer(
  app: FastifyInstance,
  token: string | undefined,
  attachmentData: { answerId: unknown; title?: unknown; link?: unknown },
) {
  const req = request(app.server).post(`/answers/${attachmentData.answerId}/attachments`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: attachmentData.title,
    link: attachmentData.link,
  })
}
