import {
  createAccountRequestSchema,
} from '@/external/zod/application/create-account/create-account-request.schema'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import {
  BaseZodSchemaValidator as BaseSchemaValidator
} from './base/base-zod-schema.validator'

export class CreateAccountSchemaValidator extends BaseSchemaValidator implements SchemaValidator {
  constructor () {
    super(createAccountRequestSchema.body)
  }
}
