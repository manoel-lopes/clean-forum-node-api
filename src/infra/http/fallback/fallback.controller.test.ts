import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { FallbackController } from './fallback.controller'

const mockResponse = () => {
  const res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn(),
    redirect: vi.fn(),
  }
  return res
}

describe('FallbackController', () => {
  let res: ReturnType<typeof mockResponse>
  const mocks = vi.hoisted(() => ({
    env: {
      NODE_ENV: 'development',
    }
  }))

  vi.mock('@/lib/env', () => mocks)

  beforeEach(() => {
    res = mockResponse()
    vi.spyOn(console, 'error').mockClear()
  })

  it('should handle a schema validation error sending a bad request error http response', () => {
    const error = new SchemaValidationError('Field is required')

    FallbackController.handle(error, {}, res)

    expect(res.code).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: error.message,
    })
  })

  it('should handle an schema validation error with unprocessable entity error http response', () => {
    const error = new SchemaValidationError('Invalid format')

    FallbackController.handle(error, {}, res)

    expect(res.code).toHaveBeenCalledWith(422)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Unprocessable Entity',
      message: error.message,
    })
  })

  it('should handle an empty request body error sending a bad request error http response', () => {
    const error = new SchemaValidationError('Request body is missing or empty')

    FallbackController.handle(error, {}, res)

    expect(res.code).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: error.message,
    })
  })

  it('should log an unexpected error and return an internal server error http response', () => {
    const error = new Error('Unexpected error')
    vi.spyOn(console, 'error').mockImplementation(() => {})

    FallbackController.handle(error, {}, res)

    expect(console.error).toHaveBeenCalledWith({ errors: error.message })
    expect(res.code).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })

  it('should not log an unexpected error and return an internal server error http response', () => {
    mocks.env.NODE_ENV = 'production'
    const error = new Error('Unexpected error')
    vi.spyOn(console, 'error').mockImplementation(() => {})

    FallbackController.handle(error, {}, res)

    expect(console.error).not.toHaveBeenCalled()
    expect(res.code).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
