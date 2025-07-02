import { z } from 'zod'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'

type URLParam = 'param' | 'query'
type URLParamType = 'route param' | 'query param'
type URLParamTypeReplacements = Record<URLParam, URLParamType>

export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      const error = ZodSchemaParser.formatErrorMessage(parsedSchema.error.errors[0])
      throw new SchemaValidationError(error)
    }
    return parsedSchema.data
  }

  private static formatErrorMessage (issue: z.ZodIssue) {
    const paramPath = issue.path.join(' ')
    const param = ZodSchemaParser.normalizeURLParam(paramPath)
    if (!param) {
      return 'Request body is missing or empty'
    }

    const message = ZodSchemaParser.normalizeErrorMessage(issue.message.toLowerCase(), param)
    return ZodSchemaParser.formatCharacterMessage(message)
  }

  private static normalizeURLParam (param: string): string {
    const replacements: URLParamTypeReplacements = {
      param: 'route param',
      query: 'query param',
    }

    let formattedParam = param
    const patterns: { [key: string]: string } = {
      '^params ': 'route param \'',
      '^query ': 'query param \'',
    }

    for (const [pattern, replacement] of Object.entries(patterns)) {
      const regex = new RegExp(pattern)
      if (regex.test(formattedParam)) {
        formattedParam = formattedParam.replace(regex, replacement) + '\''
        break
      }
    }

    const trimmedParam = formattedParam.trim() as URLParam
    return replacements[trimmedParam] || formattedParam
  }

  private static normalizeErrorMessage (message: string, param: string) {
    const formattedMessage = message
    if (formattedMessage.includes('invalid')) {
      return `Invalid ${param}`
    }

    return formattedMessage.includes('required')
      ? `The ${param} is required`
      : `The ${param} ${formattedMessage}`
  }

  private static formatCharacterMessage (message: string): string {
    return message.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
