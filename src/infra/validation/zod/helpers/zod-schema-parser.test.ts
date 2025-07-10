import { z } from 'zod'

import { ZodSchemaParser } from './zod-schema-parser'

describe('ZodSchemaParser', () => {
  const schema = z.object({
    name: z.string().min(3),
    age: z.number().min(18)
  })

  it('should return the parsed data on successful validation', () => {
    const data = { name: 'John Doe', age: 30 }

    expect(ZodSchemaParser.parse(schema, data)).toEqual(data)
  })

  it('should throw a SchemaValidationError on failed validation', () => {
    const data = { name: 'Jo', age: 17 }

    expect(() => ZodSchemaParser.parse(schema, data)).toThrow(
      'The name string must contain at least 3 characters'
    )
  })

  it('should format error messages for invalid types', () => {
    const data = { name: 'John Doe', age: '17' }

    expect(() => ZodSchemaParser.parse(schema, data)).toThrow(
      'The age expected number, received string'
    )
  })

  it('should format error messages for required fields', () => {
    const data = { age: 30 }

    expect(() => ZodSchemaParser.parse(schema, data)).toThrow(
      'The name is required'
    )
  })

  it('should format error messages for character length', () => {
    const data = { name: 'Jo', age: 30 }

    expect(() => ZodSchemaParser.parse(schema, data)).toThrow(
      'The name string must contain at least 3 characters'
    )
  })

  it('should normalize URL parameters in error messages', () => {
    const data = { params: { id: '123' }, query: { search: 'test' } }
    const schemaWithParams = z.object({
      params: z.object({ id: z.string().uuid() }),
      query: z.object({ search: z.string() })
    })

    expect(() => ZodSchemaParser.parse(schemaWithParams, data)).toThrow(
      "Invalid route param 'id'"
    )
  })
})
