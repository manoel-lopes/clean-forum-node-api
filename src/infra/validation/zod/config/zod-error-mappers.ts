import { z } from 'zod'
import type { $ZodRawIssue } from 'zod/v4/core/errors.cjs'

type Origin = 'body' | 'route' | 'query'
type IssueCode = $ZodRawIssue['code']
type Label = { quoted: string; bare: string }
const DEFAULT_ERROR = 'Invalid input'

type InvalidTypeIssue = Extract<$ZodRawIssue, { code: 'invalid_type' }>
type TooSmallIssue = Extract<$ZodRawIssue, { code: 'too_small' }>
type TooBigIssue = Extract<$ZodRawIssue, { code: 'too_big' }>
type CustomIssue = Extract<$ZodRawIssue, { code: 'custom' }>

export abstract class ZodErrorMapper {
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
    const resolvers: Partial<Record<IssueCode, (i: $ZodRawIssue) => string>> = {
      invalid_type: (i) => this.isInvalidType(i) ? this.msgInvalidType(i as InvalidTypeIssue, label) : DEFAULT_ERROR,
      too_small: (i) => this.isTooSmall(i) ? this.msgTooSmall(i as TooSmallIssue, label) : DEFAULT_ERROR,
      too_big: (i) => this.isTooBig(i) ? this.msgTooBig(i as TooBigIssue, label) : DEFAULT_ERROR,
      invalid_format: () => this.msgInvalidFormat(origin, field),
      custom: (i) => this.isCustom(i) && typeof i.message === 'string' && i.message ? i.message : DEFAULT_ERROR
    }
    const resolver = this.isKnownCode(issue.code) ? resolvers[issue.code] : undefined
    const raw = resolver ? resolver(issue) : DEFAULT_ERROR
    return this.normalizeCharacters(raw)
  }

  private static inferOriginAndField (path: $ZodRawIssue['path']): { origin: Origin; field: string } {
    const parts = Array.isArray(path) ? path.map((p) => String(p)) : []
    if (parts.length === 0) return { origin: 'body', field: '' }

    const [head, ...rest] = parts
    const h = head.toLowerCase()
    if (h === 'params' && rest.length) return { origin: 'route', field: rest.join('.') }
    if (h === 'query' && rest.length) return { origin: 'query', field: rest.join('.') }
    return { origin: 'body', field: parts.join('.') }
  }

  private static makeLabel (origin: Origin, field: string): Label {
    const byOrigin: Record<Origin, Label> = {
      body: { quoted: `'${field}'`, bare: field },
      route: { quoted: `route param '${field}'`, bare: field },
      query: { quoted: `query param '${field}'`, bare: field },
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

  private static isInvalidType (issue: $ZodRawIssue): issue is InvalidTypeIssue {
    return issue.code === 'invalid_type'
  }

  private static isTooSmall (issue: $ZodRawIssue): issue is TooSmallIssue {
    return issue.code === 'too_small'
  }

  private static isTooBig (issue: $ZodRawIssue): issue is TooBigIssue {
    return issue.code === 'too_big'
  }

  private static isCustom (issue: $ZodRawIssue): issue is CustomIssue {
    return issue.code === 'custom'
  }

  private static msgInvalidType (issue: InvalidTypeIssue, label: Label): string {
    const received = this.describeReceived((issue as { input?: unknown }).input)
    if (received === 'undefined') {
      return `The ${label.bare} is required`
    }
    return `Expected ${String((issue as { expected?: unknown }).expected) || 'value'}, received ${received} at ${label.quoted}`
  }

  private static msgTooSmall (issue: TooSmallIssue, label: Label): string {
    const min = (issue as { minimum?: number | bigint }).minimum
    const n = typeof min === 'bigint' ? Number(min) : (typeof min === 'number' ? min : 0)
    return `The ${label.quoted} must contain at least ${n} characters`
  }

  private static msgTooBig (issue: TooBigIssue, label: Label): string {
    return `The ${label.quoted} must contain fewer characters`
  }

  private static msgInvalidFormat (origin: Origin, field: string): string {
    if (field === 'email') {
      return 'Invalid email'
    }
    const byOrigin: Record<Origin, string> = {
      body: `Invalid ${origin}`,
      route: `Invalid route param '${field}'`,
      query: `Invalid query param '${field}'`,
    }
    return byOrigin[origin]
  }

  private static describeReceived (input: unknown): string {
    if (input === undefined) return 'undefined'
    if (input === null) return 'null'
    if (Array.isArray(input)) return 'array'
    if (input instanceof Date) return 'date'
    return typeof input
  }

  private static normalizeCharacters (message: string): string {
    return message.replace(/(\d+)\scharacter\(s\)/g, function (_: string, num: string) {
      const n = Number(num)
      return `${n} character${n > 1 ? 's' : ''}`
    })
  }
}
