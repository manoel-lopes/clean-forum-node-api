import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Get Question By Slug', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = aUser().withName('Auth User for Questions').build()
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = response.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and the question with answers', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question slug by fetching question
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const response = await getQuestionBySlug(app, slug, authToken)

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(questionData.title)
    expect(response.body.content).toBe(questionData.content)
    expect(response.body.answers.items).toEqual([])
    expect(response.body.answers).toHaveProperty('page')
    expect(response.body.answers).toHaveProperty('pageSize')
    expect(response.body.answers).toHaveProperty('totalItems', 0)
    expect(response.body.answers).toHaveProperty('totalPages')
    expect(response.body.answers).toHaveProperty('order')
  })
})
