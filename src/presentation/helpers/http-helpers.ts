import type { HttpResponse, HttpStatusCode } from '@/infra/http/ports/http-protocol'
import type { HttpError, HttpErrorType } from './errors/http.error'

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = (err: Error): HttpResponse => {
  return httpError({ name: 'Bad Request', message: err.message })
}

export const unauthorized = (err: Error): HttpResponse => {
  return httpError({ name: 'Unauthorized', message: err.message })
}

export const forbidden = (err: Error): HttpResponse => {
  return httpError({ name: 'Forbidden', message: err.message })
}

export const notFound = (err: Error): HttpResponse => {
  return httpError({ name: 'Not Found', message: err.message })
}

export const conflict = (err: Error): HttpResponse => {
  return httpError({ name: 'Conflict', message: err.message })
}

export const unprocessableEntity = (err: Error): HttpResponse => {
  return httpError({ name: 'Unprocessable Entity', message: err.message })
}

const httpError = (err: HttpError): HttpResponse => {
  const statusCodeMapper:Record<HttpErrorType, HttpStatusCode> = {
    'Bad Request': 400,
    Unauthorized: 401,
    Forbidden: 403,
    'Not Found': 404,
    Conflict: 409,
    'Unprocessable Entity': 422,
  }
  return {
    statusCode: statusCodeMapper[err.name],
    body: {
      error: err.name,
      message: err.message,
    },
  }
}
