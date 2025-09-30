import { aUser } from '../builders/user.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createUser, fetchUsers } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

describe('Fetch Users', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await fetchUsers(app, '')

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 when pageSize exceeds maximum', async () => {
    const httpResponse = await fetchUsers(app, authToken, { page: 1, pageSize: 101 })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchUsers(app, authToken, { page: 1, pageSize: 0 })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 200 and paginated users list', async () => {
    const user1Data = aUser().withName().build()
    const user2Data = aUser().withName().build()
    await createUser(app, user1Data)
    await createUser(app, user2Data)

    const httpResponse = await fetchUsers(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body.totalItems).toBeGreaterThanOrEqual(3)
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(3)
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchUsers(app, authToken, { page: 1, pageSize: 2 })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 2)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(httpResponse.body).toHaveProperty('items')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items).toHaveLength(2)
  })

  it('should return 200 with order parameter', async () => {
    const httpResponse = await fetchUsers(app, authToken, { order: 'asc' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'asc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })
})
