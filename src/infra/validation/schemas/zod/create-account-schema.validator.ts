import { ZodSchemaParser } from '@/external/zod/helpers/zod-schema-parser'
import {
  createAccountRequestSchema,
} from '@/external/zod/application/create-account/create-account-request.schema'
import type { SchemaValidator, SchemaParseResult } from '../../ports/schema.validator'

export class CreateAccountSchemaValidator implements SchemaValidator {
  validate (data: unknown): SchemaParseResult {
    const parsedData = ZodSchemaParser.parse(createAccountRequestSchema.body, data)
    return parsedData
  }
}
