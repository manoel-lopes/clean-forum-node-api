import { type ErrorMapCtx, z, type ZodErrorMap, ZodIssueCode } from 'zod'

type ZodIssue = {
  code: ZodIssueCode;
  path: (string | number)[];
  received?: unknown;
  expected?: unknown;
  minimum?: number | bigint;
  validation?: unknown;
  message?: string;
}

type ZodErrorMapperMethod = (
  issue: ZodIssue,
  ctx: ErrorMapCtx,
  param: string | number
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

  private static checkInvalidTypes (issue: ZodIssue, _ctx: ErrorMapCtx, param: string | number) {
    return issue.received === 'undefined'
      ? `The ${param} is required`
      : `Expected ${issue.expected}, received ${issue.received} at '${param}'`
  }

  private static checkTooSmall (issue: ZodIssue, _ctx: ErrorMapCtx, param: string | number) {
    return `The '${param}' must contain at least ${issue.minimum} characters`
  }

  private static checkTooBig (issue: ZodIssue, _ctx: ErrorMapCtx, param: string | number) {
    return `The '${param}' must contain  at most ${issue.minimum} characters`
  }

  private static checkInvalidString (issue: ZodIssue, _ctx: ErrorMapCtx, param: string | number) {
    return issue.validation === 'uuid'
      ? `Invalid route param '${param}'`
      : `Invalid ${param}`
  }
}
