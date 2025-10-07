import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import { PrismaHelper } from '../infra/prisma/prisma-helpers'

export type CreateUserData = {
  name?: unknown
  email?: unknown
  password?: unknown
}

type VerifyEmailValidationData = {
  email?: unknown
  code?: unknown
}

export async function createUser (
  app: FastifyInstance,
  userData: CreateUserData
) {
  const response = await request(app.server)
    .post('/users')
    .send(userData)

  return response
}

export async function deleteUser (
  app: FastifyInstance,
  authToken: string
) {
  const response = await request(app.server)
    .delete('/users')
    .set('Authorization', `Bearer ${authToken}`)

  return response
}

export async function fetchUsers (
  app: FastifyInstance,
  authToken: string,
  params?: PaginationParams
) {
  const queryParams = params
    ? `?${Object.entries(params).map(([key, value]) => value !== undefined ? `${key}=${value}` : '').filter(Boolean).join('&')}`
    : ''
  return await request(app.server)
    .get(`/users${queryParams}`)
    .set('Authorization', `Bearer ${authToken}`)
}

export async function getUserByEmail (app: FastifyInstance, authToken: string, {
  email
}: {
  email: unknown
}) {
  return await request(app.server)
    .get(`/users/${email}`)
    .set('Authorization', `Bearer ${authToken}`)
}

export async function sendEmailValidation (app: FastifyInstance, { email }: { email: unknown }) {
  return await request(app.server)
    .post('/users/send-email-validation')
    .send({ email })
}

export async function verifyEmailValidation (app: FastifyInstance, data: VerifyEmailValidationData) {
  return await request(app.server)
    .post('/users/verify-email-validation')
    .send(data)
}

export async function getLastEmailCodeForEmail (email: unknown): Promise<string | undefined> {
  return PrismaHelper.getLastEmailCodeForEmail(String(email))
}

export async function clearEmailCodes (): Promise<void> {
  await PrismaHelper.cleanup()
}
