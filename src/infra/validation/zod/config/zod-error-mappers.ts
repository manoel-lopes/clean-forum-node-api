import { z, type ZodErrorMap, ZodIssueCode } from 'zod'

type ZodErrorMapperMethod = (issue: {
  code: ZodIssueCode;
  path: (string | number)[];
  received?: unknown;
  expected?: unknown;
  minimum?: number | bigint;
  validation?: unknown;
  message?: string;
}, ctx: { defaultError: string },
  param: string | number | boolean | null | undefined
) => string

export abstract class ZodErrorMapper {
  static setErrorMap () {
    z.setErrorMap(this.errorMapper)
  }

  private static errorMapper: ZodErrorMap = (issue, ctx) => {
    const resolversMapper: Record<string, ZodErrorMapperMethod> = {
      [ZodIssueCode.invalid_type]: this.checkInvalidTypes,
      [ZodIssueCode.too_small]: this.checkTooSmall,
      [ZodIssueCode.too_big]: this.checkTooBig,
      [ZodIssueCode.invalid_string]: this.checkInvalidString,
      [ZodIssueCode.custom]: (issue, ctx, _param) => issue.message ?? ctx.defaultError,
    }
    const param = this.extractParam(issue)
    const resolver = resolversMapper[issue.code]
    const message = resolver ? resolver(issue, ctx, param) : ctx.defaultError
    return { message }
  }

  private static extractParam (issue: { path: unknown[] }) {
    const param = issue.path.at(-1)
    return param ? String(param) : ''
  }

  static checkInvalidTypes: ZodErrorMapperMethod = (issue, _ctx, param) => {
    return issue.received === 'undefined'
      ? `The ${param} is required`
      : `Expected ${issue.expected}, received ${issue.received} at '${param}'`
  }

  static checkTooSmall: ZodErrorMapperMethod = (issue, _ctx, param) => {
    return `The '${param}' must contain at least ${issue.minimum} characters`
  }

  static checkTooBig: ZodErrorMapperMethod = (issue, _ctx, param) => {
    return `The '${param}' must contain  at most ${issue.minimum} characters`
  }

  static checkInvalidString: ZodErrorMapperMethod = (issue, _ctx, param) => {
    return issue.validation === 'uuid'
      ? `Invalid route param '${param}'`
      : `Invalid ${param}`
  }
}
