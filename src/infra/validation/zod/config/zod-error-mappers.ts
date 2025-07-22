import { z, type ZodErrorMap, ZodIssueCode } from 'zod'

export abstract class ZodErrorMapper {
  static setErrorMap () {
    z.setErrorMap(this.errorMapper)
  }

  private static errorMapper: ZodErrorMap = (issue, ctx) => {
    const resolversMapper: Record<
    ZodIssueCode,
    (issue: any, ctx: any, param: string) => string
  > = {
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

  private static extractParam (issue: { path: unknown[] }): string {
    const last = issue.path.at(-1)
    return last !== undefined ? String(last) : ''
  }

  static checkInvalidTypes (issue: any, _ctx: any, param: string) {
    return issue.received === 'undefined'
      ? `The ${param} is required`
      : `Expected ${issue.expected}, received ${issue.received} at '${param}'`
  }

  static checkTooSmall (issue: any, _ctx: any, param: string) {
    return `The '${param}' must contain at least ${issue.minimum} characters`
  }

  static checkTooBig (issue: any, _ctx: any, param: string) {
    return `The '${param}' must contain  at most ${issue.minimum} characters`
  }

  static checkInvalidString (issue: any, _ctx: any, param: string) {
    return issue.validation === 'uuid'
      ? `Invalid route param '${param}'`
      : `Invalid ${param}`
  }
}
