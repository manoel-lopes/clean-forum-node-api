import request from 'supertest'
import { createTestApp } from '../helpers/app-factory'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Delete Account Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 204 on successful account deletion', async () => {
    const userData = generateUniqueUserData('John Doe')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    const httpResponse = await request(app.server)
      .delete('/users')
      .set('Authorization', `Bearer ${authResponse.body.token}`)

    expect(httpResponse.statusCode).toBe(204)
  })
})
