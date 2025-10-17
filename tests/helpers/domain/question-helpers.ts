import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import type { Question } from '@/domain/enterprise/entities/question.entity'

export type CreateQuestionData = {
  title?: unknown
  content?: unknown
}

export type CreateQuestionFlexibleData = {
  title?: unknown
  content?: unknown
}

export type CreateQuestionCommentData = {
  questionId?: unknown
  content?: unknown
}

export type UpdateQuestionData = {
  questionId: unknown
  title?: unknown
  content?: unknown
}

export type CreateQuestionAttachmentData = {
  questionId: unknown
  title: unknown
  link: unknown
}

export type UpdateQuestionAttachmentData = {
  attachmentId: unknown
  title?: unknown
  link?: unknown
}

export function generateUniqueQuestionData(): CreateQuestionData {
  return {
    title: `Test Question ${uuidv7()}`,
    content: 'This is test question content',
  }
}

export async function createQuestion(app: FastifyInstance, token: string, questionData: CreateQuestionData) {
  return await request(app.server).post('/questions').set('Authorization', `Bearer ${token}`).send(questionData)
}

export async function fetchQuestions(
  app: FastifyInstance,
  token?: string,
  options?: { page?: number; pageSize?: number },
) {
  return request(app.server)
    .get(`/questions${options ? `?page=${options.page}&pageSize=${options.pageSize}` : ''}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function getQuestionBySlug(app: FastifyInstance, slug: string, token: string) {
  return request(app.server).get(`/questions/${slug}`).set('Authorization', `Bearer ${token}`)
}

export async function commentOnQuestion(app: FastifyInstance, token: string, commentData: CreateQuestionCommentData) {
  return await request(app.server)
    .post(`/questions/${commentData.questionId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function deleteQuestion(
  app: FastifyInstance,
  token: string,
  {
    questionId,
  }: {
    questionId: unknown
  },
) {
  return request(app.server).delete(`/questions/${questionId}`).set('Authorization', `Bearer ${token}`)
}

export async function chooseQuestionBestAnswer(
  app: FastifyInstance,
  token: string,
  {
    answerId,
  }: {
    answerId: unknown
  },
) {
  return request(app.server).patch(`/questions/${answerId}/choose`).set('Authorization', `Bearer ${token}`)
}

export async function getQuestionByTile(
  app: FastifyInstance,
  authToken: string,
  questionTitle: unknown,
): Promise<Question> {
  const fetchQuestionsResponse = await fetchQuestions(app, authToken)
  const createdQuestion = fetchQuestionsResponse.body.items.find((q: Question) => {
    return q.title === questionTitle
  })
  return createdQuestion
}

export async function updateQuestion(app: FastifyInstance, token: string | undefined, updateData: UpdateQuestionData) {
  const req = request(app.server).patch(`/questions/${updateData.questionId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: updateData.title,
    content: updateData.content,
  })
}

export async function createQuestionAttachment(
  app: FastifyInstance,
  token: string,
  attachmentData: CreateQuestionAttachmentData,
) {
  return request(app.server)
    .post(`/questions/${attachmentData.questionId}/attachments`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: attachmentData.title,
      link: attachmentData.link,
    })
}

export async function updateQuestionAttachment(
  app: FastifyInstance,
  token: string | undefined,
  updateData: UpdateQuestionAttachmentData,
) {
  const req = request(app.server).patch(`/questions/attachments/${updateData.attachmentId}`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: updateData.title,
    link: updateData.link,
  })
}

export async function deleteQuestionAttachment(app: FastifyInstance, token: string, attachmentId: unknown) {
  return request(app.server).delete(`/questions/attachments/${attachmentId}`).set('Authorization', `Bearer ${token}`)
}

export async function attachToQuestion(
  app: FastifyInstance,
  token: string | undefined,
  attachmentData: { questionId: unknown; title?: unknown; link?: unknown },
) {
  const req = request(app.server).post(`/questions/${attachmentData.questionId}/attachments`)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  return req.send({
    title: attachmentData.title,
    link: attachmentData.link,
  })
}
