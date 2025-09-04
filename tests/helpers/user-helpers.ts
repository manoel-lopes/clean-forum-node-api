import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface CreateUserFlexibleData {
  name?: unknown
  email?: unknown
  password?: unknown
}

export function generateUniqueUserData (namePrefix = 'User'): CreateUserData {
  return {
    name: namePrefix,
    email: `${namePrefix.toLowerCase().replace(/\s+/g, '.')}.${uuidv7()}@example.com`,
    password: 'P@ssword123'
  }
}

export async function createUser (app: FastifyInstance, userData: CreateUserData | CreateUserFlexibleData) {
  const response = await request(app.server)
    .post('/users')
    .send(userData)

  return response
}

type AuthCredentials = {
  email: string
  password: string
}

export interface AuthCredentialsFlexible {
  email?: unknown
  password?: unknown
}

export async function authenticateUser (app: FastifyInstance, credentials: AuthCredentials | AuthCredentialsFlexible) {
  const response = await request(app.server)
    .post('/auth')
    .send(credentials)

  return response
}

export async function deleteUser (app: FastifyInstance, authToken: string) {
  const response = await request(app.server)
    .delete('/users')
    .set('Authorization', `Bearer ${authToken}`)

  return response
}

export async function fetchUsers (app: FastifyInstance, authToken: string, queryParams?: string) {
  const url = queryParams ? `/users?${queryParams}` : '/users'
  const response = await request(app.server)
    .get(url)
    .set('Authorization', `Bearer ${authToken}`)

  return response
}

export async function getUserByEmail (app: FastifyInstance, authToken: string, {
  email
}: {
  email: unknown
}) {
  const response = await request(app.server)
    .get(`/users/${email}`)
    .set('Authorization', `Bearer ${authToken}`)

  return response
}

export interface RefreshTokenData {
  refreshTokenId?: unknown
}

export async function refreshAccessToken (app: FastifyInstance, tokenData: RefreshTokenData) {
  const response = await request(app.server)
    .post('/auth/refresh-token')
    .send(tokenData)

  return response
}

export interface VerifyEmailValidationData {
  email?: unknown
  code?: unknown
}

export async function sendEmailValidation (app: FastifyInstance, { email }: { email: string }) {
  const response = await request(app.server)
    .post('/send-email-validation')
    .send({ email })

  return response
}

export async function verifyEmailValidation (app: FastifyInstance, data: VerifyEmailValidationData) {
  const response = await request(app.server)
    .post('/users/verify-email-validation')
    .send(data)

  return response
}
