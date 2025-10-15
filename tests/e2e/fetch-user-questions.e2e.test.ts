import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { authenticateUser } from '../helpers/auth/session-helpers'
import { createQuestion } from '../helpers/domain/question-helpers'
import { createUser } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

describe('Fetch User Questions (e2e)', () => {
  it('should fetch all questions from a specific user', async () => {
    const user1Data = aUser().withEmail('user1-fetch@example.com').build()
    const user2Data = aUser().withEmail('user2-fetch@example.com').build()

    const user1Response = await createUser(app, user1Data)
    await createUser(app, user2Data)

    const auth1Response = await authenticateUser(app, {
      email: user1Data.email,
      password: user1Data.password
    })
    const auth2Response = await authenticateUser(app, {
      email: user2Data.email,
      password: user2Data.password
    })

    const user1Token = auth1Response.body.token
    const user2Token = auth2Response.body.token

    const q1 = await createQuestion(app, user1Token, aQuestion().withTitle(`Question 1 ${Date.now()}`).build())
    const q2 = await createQuestion(app, user1Token, aQuestion().withTitle(`Question 2 ${Date.now()}`).build())
    const q3 = await createQuestion(app, user2Token, aQuestion().withTitle(`Question 3 ${Date.now()}`).build())

    expect(q1.statusCode).toBe(201)
    expect(q2.statusCode).toBe(201)
    expect(q3.statusCode).toBe(201)

    const response = await app.inject({
      method: 'GET',
      url: `/users/${user1Response.body.id}/questions`,
      headers: {
        authorization: `Bearer ${user1Token}`
      }
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toHaveLength(2)
    expect(body.items.every((q: { authorId: string }) => q.authorId === user1Response.body.id)).toBe(true)
    expect(body.totalItems).toBe(2)
  })

  it('should return empty list if user has no questions', async () => {
    const userData = aUser().withEmail('newuser-fetch@example.com').build()
    const userResponse = await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    const authToken = authResponse.body.token

    const response = await app.inject({
      method: 'GET',
      url: `/users/${userResponse.body.id}/questions`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    expect(response.statusCode).toBe(200)
    const body = response.json()
    expect(body.items).toHaveLength(0)
    expect(body.totalItems).toBe(0)
  })

  it('should paginate user questions correctly', async () => {
    const userData = aUser().withEmail('paginationuser-fetch@example.com').build()
    const userResponse = await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    const authToken = authResponse.body.token

    for (let i = 1; i <= 15; i++) {
      await createQuestion(app, authToken, aQuestion().withTitle(`Question ${i} ${Date.now()}`).build())
    }

    const page1Response = await app.inject({
      method: 'GET',
      url: `/users/${userResponse.body.id}/questions?page=1&pageSize=10`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    const page2Response = await app.inject({
      method: 'GET',
      url: `/users/${userResponse.body.id}/questions?page=2&pageSize=10`,
      headers: {
        authorization: `Bearer ${authToken}`
      }
    })

    expect(page1Response.statusCode).toBe(200)
    expect(page2Response.statusCode).toBe(200)

    const page1 = page1Response.json()
    const page2 = page2Response.json()

    expect(page1.items).toHaveLength(10)
    expect(page2.items).toHaveLength(5)
    expect(page1.totalItems).toBe(15)
    expect(page1.totalPages).toBe(2)
  })

  it('should require authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/some-user-id/questions'
    })

    expect(response.statusCode).toBe(401)
  })
})
