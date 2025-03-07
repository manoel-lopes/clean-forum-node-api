import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'

export class SchemaValidatorStub implements SchemaValidator {
  validate () {
    return {}
  }
}
