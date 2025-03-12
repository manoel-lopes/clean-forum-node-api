import {
  listQuestionsRequestSchema,
} from '@/external/zod/application/list-questions/list-questions-request.schema'
import type { ListItemsSchemaValidator } from '@/infra/validation/ports/list-items-schema.validator'
import {
  BaseListItemsZodSchemaValidator as BaseSchemaValidator,
} from './base/base-list-items-zod-schema.validator'

export class ListQuestionsZodSchemaValidator extends BaseSchemaValidator
  implements ListItemsSchemaValidator {
  constructor () {
    super(listQuestionsRequestSchema)
  }
}
