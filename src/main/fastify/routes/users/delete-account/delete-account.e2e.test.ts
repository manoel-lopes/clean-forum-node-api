import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../users.routes'

describe('Delete Account Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, sessionRoutes] })
  await app.ready()

  afterAll(async () => {
    await app.close()
  })

  it('should return 204 on successful account deletion', async () => {
    const userData = {
      name: 'John Doe',
      email: `john.doe.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    await request(app.server)
      .post('/users')
      .send(userData)

    const authResponse = await request(app.server).post('/auth')
      .send({
        email: userData.email,
        password: userData.password,
      })

    const httpResponse = await request(app.server)
      .delete('/users')
      .set('Authorization', `Bearer ${authResponse.body.token}`)

    expect(httpResponse.statusCode).toBe(204)
  })
})
