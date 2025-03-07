export type SchemaParseResult = Record<string, unknown>

export type SchemaValidator<T= unknown, Q=SchemaParseResult> = {
  validate: (data: T) => Q
}
