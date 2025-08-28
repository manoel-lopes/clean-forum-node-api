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
    const { origin, field } = this.inferOriginAndField(issue.path)
    if (!field) return 'Request body is missing or empty'
    const label = this.makeLabel(origin, field)
    const messageBuilder = this.ERROR_BUILDERS[issue.code]
    const message = messageBuilder?.(issue, label) ?? DEFAULT_ERROR
    return this.normalizeCharacters(message)
  }

  private static inferOriginAndField (path: $ZodRawIssue['path']): { origin: 'body'; field: string } {
    const parts = Array.isArray(path) ? path.map((p) => String(p)) : []
    if (parts.length === 0) return { origin: 'body', field: '' }
    return { origin: 'body', field: parts.join('.') }
  }

  private static makeLabel (origin: 'body', field: string): Label {
    const byOrigin: Record<'body', Label> = {
      body: { quoted: `'${field}'`, bare: field }
    }
    return byOrigin[origin]
  }

  private static isKnownCode (code: $ZodRawIssue['code']) {
    return code === 'invalid_type' ||
           code === 'too_small' ||
           code === 'too_big' ||
           code === 'custom' ||
           code === 'invalid_format' ||
           code === 'not_multiple_of' ||
           code === 'unrecognized_keys' ||
           code === 'invalid_union' ||
           code === 'invalid_key' ||
           code === 'invalid_element' ||
           code === 'invalid_value'
  }

  private static isRawIssue (i: unknown): i is $ZodRawIssue {
    return typeof i === 'object' && i !== null && 'code' in i && 'path' in i
  }

  private static isInvalidType (issue: $ZodRawIssue) {
    return issue.code === 'invalid_type'
  }

  private static isTooSmall (issue: $ZodRawIssue) {
    return issue.code === 'too_small'
  }

  private static isTooBig (issue: $ZodRawIssue) {
    return issue.code === 'too_big'
  }

  private static isCustom (issue: $ZodRawIssue) {
    return issue.code === 'custom'
  }

  private static buildInvalidTypeMessage (issue: $ZodRawIssue, label: Label): string {
    const received = this.getInputDescription(issue.input)
    return received === 'undefined'
      ? `The ${label.bare} is required`
      : `Invalid type for ${label.quoted}`
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
    return message.replace(/(\d+)\scharacter\(s\)/g, function (_: string, num: string) {
      const n = Number(num)
      return `${n} character${n > 1 ? 's' : ''}`
    })
  }
}
