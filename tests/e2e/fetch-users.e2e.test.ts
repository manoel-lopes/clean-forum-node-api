import { createTestApp } from '../helpers/app-factory'
import { PrismaHelper } from '../helpers/persistence/prisma.helper'
import { authenticateUser, createUser, fetchUsers, generateUniqueUserData } from '../helpers/user-helpers'

describe('Fetch Users Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = generateUniqueUserData('Auth User for Users')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token
  })

  afterAll(async () => {
    await PrismaHelper.cleanDatabase()
    await app.close()
  })

  it('should return 200 and paginated users list', async () => {
    const user1Data = generateUniqueUserData('User One')
    const user2Data = generateUniqueUserData('User Two')

    await createUser(app, user1Data)
    await createUser(app, user2Data)

    const httpResponse = await fetchUsers(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(3)
    expect(httpResponse.body.items[0]).toHaveProperty('id')
    expect(httpResponse.body.items[0]).toHaveProperty('name')
    expect(httpResponse.body.items[0]).toHaveProperty('email')
    expect(httpResponse.body.items[0]).toHaveProperty('createdAt')
    expect(httpResponse.body.items[0]).toHaveProperty('updatedAt')
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'page=1&perPage=2')

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.page).toBe(1)
    expect(httpResponse.body.pageSize).toBe(2)
    expect(httpResponse.body.items).toHaveLength(2)
  })

  it('should return 200 with order parameter', async () => {
    const httpResponse = await fetchUsers(app, authToken, 'order=asc')

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(httpResponse.body.order).toBe('asc')
  })
})
