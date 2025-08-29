import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export interface CreateQuestionData {
  title?: string
  content?: string
}

export interface CreateQuestionCommentData {
  questionId: string
  content: string
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

export async function fetchQuestions (app: FastifyInstance, token?: string) {
  return request(app.server)
    .get('/questions')
    .set('Authorization', `Bearer ${token}`)
}

export async function getQuestionBySlug (app: FastifyInstance, slug: string, token: string) {
  return request(app.server)
    .get(`/questions/${slug}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function commentOnQuestion (app: FastifyInstance, token: string, commentData: CreateQuestionCommentData) {
  return await request(app.server)
    .post(`/questions/${commentData.questionId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(commentData)
}

export async function deleteQuestion (app: FastifyInstance, token: string, questionId: string) {
  return request(app.server)
    .delete(`/questions/${questionId}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function chooseQuestionBestAnswer (app: FastifyInstance, token: string, answerId: string) {
  return request(app.server)
    .patch(`/questions/${answerId}/choose`)
    .set('Authorization', `Bearer ${token}`)
}
