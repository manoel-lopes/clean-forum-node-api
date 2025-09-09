import type { FastifyInstance } from 'fastify'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createUser, fetchUsers } from '../helpers/user-helpers'

describe('Fetch Users', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and paginated users list', async () => {
    const user1Data = aUser().withName('User One').build()
    const user2Data = aUser().withName('User Two').build()

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

    // Validate user structure
    const firstUser = httpResponse.body.items[0]
    expect(firstUser).toHaveProperty('id')
    expect(typeof firstUser.id).toBe('string')
    expect(firstUser).toHaveProperty('name')
    expect(typeof firstUser.name).toBe('string')
    expect(firstUser).toHaveProperty('email')
    expect(typeof firstUser.email).toBe('string')
    expect(firstUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(firstUser).toHaveProperty('createdAt')
    expect(firstUser).toHaveProperty('updatedAt')
    expect(firstUser).not.toHaveProperty('password')
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'page=1&perPage=2')

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
    const httpResponse = await fetchUsers(app, authToken, 'order=asc')

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'asc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 422 when pageSize exceeds maximum', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'page=1&perPage=101')

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'page=1&perPage=0')

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should accept maximum valid pageSize', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'page=1&perPage=100')

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('pageSize', 100)
  })
})
