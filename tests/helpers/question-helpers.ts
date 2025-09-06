import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import type { Question } from '@/domain/entities/question/question.entity'

export interface CreateQuestionData {
  title?: unknown
  content?: unknown
}

export interface CreateQuestionFlexibleData {
  title?: unknown
  content?: unknown
}

export interface CreateQuestionCommentData {
  questionId: string
  content: string
}

export interface CreateQuestionCommentFlexibleData {
  questionId?: unknown
  content?: unknown
}

export function generateUniqueQuestionData (): CreateQuestionData {
  return {
    title: `Test Question ${uuidv7()}`,
    content: 'This is test question content'
  }
}

export async function createQuestion (app: FastifyInstance, token: string, questionData: CreateQuestionData) {
  return await request(app.server)
    .post('/questions')
    .set('Authorization', `Bearer ${token}`)
    .send(questionData)
}

export async function fetchQuestions (app: FastifyInstance, token?: string, options?: { page?: number, perPage?: number }) {
  return request(app.server)
    .get(`/questions${options ? `?page=${options.page}&perPage=${options.perPage}` : ''}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function getQuestionBySlug (app: FastifyInstance, slug: string, token: string) {
  return request(app.server)
    .get(`/questions/${slug}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function commentOnQuestion (app: FastifyInstance, token: string, commentData: CreateQuestionCommentData | CreateQuestionCommentFlexibleData, questionIdInPath?: string) {
  const pathQuestionId = questionIdInPath || commentData.questionId
  return await request(app.server)
    .post(`/questions/${pathQuestionId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function deleteQuestion (app: FastifyInstance, token: string, {
  questionId
}: {
  questionId: string
}) {
  return request(app.server)
    .delete(`/questions/${questionId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function chooseQuestionBestAnswer (app: FastifyInstance, token: string, {
  answerId
}: {
  answerId: string
}) {
  return request(app.server)
    .patch(`/questions/${answerId}/choose`)
    .set('Authorization', `Bearer ${token}`)
}

export async function getQuestionByTile (
  app: FastifyInstance,
  authToken: string,
  questionTitle: unknown
): Promise<Question> {
  const fetchQuestionsResponse = await fetchQuestions(app, authToken)
  const createdQuestion = fetchQuestionsResponse.body.items.find((q: Question) => {
    return q.title === questionTitle
  })
  return createdQuestion
}
