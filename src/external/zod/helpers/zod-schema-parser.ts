import { z } from 'zod'
import type { SchemaParseResult } from '@/infra/validation/ports/schema.validator'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'

type URLParam = 'param' | 'query'
type URLParamType = 'route param' | 'query param'
type URLParamTypeReplacements = Record<URLParam, URLParamType>

export abstract class ZodSchemaParser {
  static parse<T = SchemaParseResult>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (!parsedSchema.success) {
      const error = this.makeErrorMessage(parsedSchema.error.errors[0])
      throw new SchemaValidationError(error)
    }
    return parsedSchema.data
  }

  private static makeErrorMessage (issue: z.ZodIssue): string {
    const paramPath = issue.path.join(' ')
    const param = this.getNormalizedParam(paramPath) || 'Request body is missing or empty'
    const normalizedMessage = this.normalizeError(issue.message.toLowerCase(), param)
    return this.formatCharacterMessage(normalizedMessage)
  }

  private static getNormalizedParam (param: string): string | null {
    const patterns: Record<string, string> = {
      '^params ': 'route param \'',
      '^query ': 'query param \'',
    }

    const formattedParam = Object.entries(patterns).reduce(
      (result, [pattern, replacement]) => result.replace(new RegExp(pattern), replacement),
      param
    )

    return `${this.replaceURLParam(formattedParam)}${formattedParam.includes('\'') ? '' : '\''}`
  }

  private static replaceURLParam (param: string): string {
    const replacements: URLParamTypeReplacements = {
      param: 'route param',
      query: 'query param',
    }

    const trimmedParam = param.trim() as URLParam
    return replacements[trimmedParam] || param
  }

  private static normalizeError (message: string, param: string): string {
    return message.includes('invalid')
      ? `Invalid ${param}`
      : message.includes('required')
        ? `The ${param} is required`
        : `The ${param} ${message}`
  }

  private static formatCharacterMessage (message: string): string {
    return message.replace(/(\d+)\scharacter\(s\)/g, (_, num) => {
      return `${num} character${num > 1 ? 's' : ''}`
    })
  }
}
