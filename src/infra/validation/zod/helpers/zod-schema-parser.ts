import { z, ZodIssueCode } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let message: string
  let param: string = ''
  if (issue.path.length > 0) {
    param = String(issue.path[issue.path.length - 1])
  }
  // Special case for empty body
  if (
    issue.path.length === 0 &&
    issue.code === ZodIssueCode.invalid_type &&
    issue.message &&
     issue.message.toLowerCase().includes('required')) {
    return { message: 'Request body is missing or empty' }
  }
  if (issue.code === ZodIssueCode.invalid_type) {
    if (issue.received === 'undefined') {
      message = `The ${param} is required`
    } else {
      message = `Expected ${issue.expected}, received ${issue.received} at '${param}'`
    }
  } else if (issue.code === ZodIssueCode.too_small) {
    message = `The '${param}' must contain at least ${issue.minimum} characters`
  } else if (issue.code === ZodIssueCode.too_big) {
    message = `The '${param}' must contain at most ${issue.maximum} characters`
  } else if (issue.code === ZodIssueCode.invalid_string) {
    if (issue.validation === 'uuid') {
      message = `Invalid route param '${param}'`
    } else {
      message = `Invalid ${param}`
    }
  } else if (issue.code === ZodIssueCode.custom) {
    message = issue.message ?? ctx.defaultError
  } else {
    message = ctx.defaultError
  }
  return { message }
}
z.setErrorMap(customErrorMap)
export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      // Check for the specific "empty body" scenario
      const allIssuesAreMissingRequired = parsedSchema.error.issues.every(
        issue => issue.code === ZodIssueCode.invalid_type && issue.received === 'undefined'
      )
      if (Object.keys(data as object).length === 0 && allIssuesAreMissingRequired) {
        throw new SchemaValidationError('Request body is missing or empty')
      }
      // For other validation errors, use fromZodError with the custom map
      const validationError = fromZodError(parsedSchema.error, { prefix: null, issueSeparator: '; ', includePath: false })
      throw new SchemaValidationError(validationError.message)
    }
    return parsedSchema.data
  }
}
