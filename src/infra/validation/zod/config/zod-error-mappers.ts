import { z } from 'zod'
import type { $ZodRawIssue } from 'zod/v4/core/errors.cjs'

const DEFAULT_ERROR = 'Invalid input'

type Label = { quoted: string; bare: string }

type MessageBuilder = (issue: $ZodRawIssue, label: Label) => string

const INPUT_TYPE_DESCRIPTIONS: Record<string, string> = {
  undefined: 'undefined',
  null: 'null',
  array: 'array',
  date: 'date'
}

const INPUT_TYPE_MATCHERS = [
  { predicate: (input: unknown) => input === undefined, type: 'undefined' },
  { predicate: (input: unknown) => input === null, type: 'null' },
  { predicate: (input: unknown) => Array.isArray(input), type: 'array' },
  { predicate: (input: unknown) => input instanceof Date, type: 'date' }
] as const

export abstract class ZodErrorMapper {
  private static readonly ERROR_BUILDERS: Record<string, MessageBuilder> = {
    invalid_type: this.buildInvalidTypeMessage.bind(this),
    too_small: this.buildTooSmallMessage.bind(this),
    too_big: this.buildTooBigMessage.bind(this),
    invalid_format: this.buildInvalidFormatMessage.bind(this),
    custom: this.buildCustomMessage.bind(this)
  }

  static setErrorMap (): void {
    z.config({
      customError: (issue) => ZodErrorMapper.format(issue)
    })
  }

  static format (issue: unknown): string {
    if (!this.isRawIssue(issue)) return DEFAULT_ERROR
    return this.buildMessage(issue)
  }

  private static buildMessage (issue: $ZodRawIssue): string {
    const field = this.extractField(issue.path)
    if (!field) return 'Request body is missing or empty'
    const label = this.createLabel(field)
    const messageBuilder = this.ERROR_BUILDERS[issue.code]
    const message = messageBuilder?.(issue, label) ?? DEFAULT_ERROR
    return this.normalizeCharacters(message)
  }

  private static extractField (path: $ZodRawIssue['path']): string {
    const parts = Array.isArray(path) ? path.map(String) : []
    return parts.join('.')
  }

  private static createLabel (field: string): Label {
    return { quoted: `'${field}'`, bare: field }
  }

  private static isRawIssue (i: unknown): i is $ZodRawIssue {
    return typeof i === 'object' && i !== null && 'code' in i && 'path' in i
  }

  private static buildInvalidTypeMessage (issue: $ZodRawIssue, label: Label): string {
    const received = this.getInputDescription(issue.input)
    if (received === 'undefined') {
      return `The ${label.bare} is required`
    }
    return `Expected ${issue.expected} for ${label.quoted}, received ${received}`
  }

  private static buildTooSmallMessage (issue: $ZodRawIssue, label: Label): string {
    const min = Number(issue.minimum) || 0
    return `The ${label.quoted} must contain at least ${min} characters`
  }

  private static buildTooBigMessage (issue: $ZodRawIssue, label: Label): string {
    const max = Number(issue.maximum) || 0
    return `The ${label.quoted} must contain at most ${max} characters`
  }

  private static buildInvalidFormatMessage (_: $ZodRawIssue, label: Label): string {
    return `Invalid ${label.bare}`
  }

  private static buildCustomMessage (issue: $ZodRawIssue): string {
    const hasValidMessage = typeof issue.message === 'string' && issue.message
    return hasValidMessage ? issue.message : DEFAULT_ERROR
  }

  private static getInputDescription (input: unknown): string {
    const matcher = INPUT_TYPE_MATCHERS.find(({ predicate }) => predicate(input))
    return matcher ? INPUT_TYPE_DESCRIPTIONS[matcher.type] : typeof input
  }

  private static normalizeCharacters (message: string): string {
    return message.replace(/(\d+)\scharacter\(s\)/g, (_, num: string) => {
      const n = Number(num)
      return `${n} character${n === 1 ? '' : 's'}`
    })
  }
}
