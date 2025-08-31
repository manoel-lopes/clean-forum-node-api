import { aUser } from '../builders/user.builder'
import { aQuestion } from '../builders/question.builder'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, fetchQuestions } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Fetch Questions Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = aUser().withName('Auth User for Questions').build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and an empty list when no questions exist', async () => {
    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 200 and paginated questions when questions exist', async () => {
    const question1Data = aQuestion().build()
    const question2Data = aQuestion().build()

    await createQuestion(app, authToken, question1Data)
    await createQuestion(app, authToken, question2Data)

    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body.items[0]).toHaveProperty('id')
    expect(httpResponse.body.items[0]).toHaveProperty('title')
    expect(httpResponse.body.items[0]).toHaveProperty('content')
    expect(httpResponse.body.items[0]).toHaveProperty('slug')
    expect(httpResponse.body.items[0]).toHaveProperty('createdAt')
    expect(httpResponse.body.items[0]).toHaveProperty('updatedAt')
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      perPage: 1
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.page).toBe(1)
    expect(httpResponse.body.pageSize).toBe(1)
  })
})
