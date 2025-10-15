import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupAnswerWithAttachments () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const answerData = anAnswer().build()
  const answerResponse = await createAnswer(app, authToken, {
    questionId: createdQuestion.id,
    content: answerData.content
  })
  const createdAnswer = answerResponse.body

  await app.inject({
    method: 'POST',
    url: `/answers/${createdAnswer.id}/attachments`,
    headers: { authorization: `Bearer ${authToken}` },
    payload: { title: 'Doc 1', link: 'https://example.com/doc1.pdf' }
  })

  await app.inject({
    method: 'POST',
    url: `/answers/${createdAnswer.id}/attachments`,
    headers: { authorization: `Bearer ${authToken}` },
    payload: { title: 'Doc 2', link: 'https://example.com/doc2.pdf' }
  })

  return { authToken, answerId: createdAnswer.id }
}

describe('Fetch Answer Attachments', () => {
  it('should fetch attachments for an answer', async () => {
    const { authToken, answerId } = await setupAnswerWithAttachments()

    const response = await app.inject({
      method: 'GET',
      url: `/answers/${answerId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toHaveLength(2)
    expect(body.page).toBe(1)
    expect(body.totalItems).toBe(2)
  })

  it('should return empty list when answer has no attachments', async () => {
    const authToken = await makeAuthToken(app)
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const answerData = anAnswer().build()
    const answerResponse = await createAnswer(app, authToken, {
      questionId: createdQuestion.id,
      content: answerData.content
    })

    const response = await app.inject({
      method: 'GET',
      url: `/answers/${answerResponse.body.id}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toHaveLength(0)
    expect(body.totalItems).toBe(0)
  })

  it('should support pagination', async () => {
    const { authToken, answerId } = await setupAnswerWithAttachments()

    const response = await app.inject({
      method: 'GET',
      url: `/answers/${answerId}/attachments?page=1&pageSize=1`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toHaveLength(1)
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(1)
    expect(body.totalItems).toBe(2)
    expect(body.totalPages).toBe(2)
  })
})
