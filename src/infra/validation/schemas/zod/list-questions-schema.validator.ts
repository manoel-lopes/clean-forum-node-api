import {
  listQuestionsRequestSchema,
} from '@/external/zod/application/list-questions/list-questions-request.schema'
import { BaseListItemsZodSchemaValidator } from './base/base-list-items-zod-schema.validator'

export class ListQuestionsSchemaValidator extends BaseListItemsZodSchemaValidator {
  constructor () {
    super(listQuestionsRequestSchema)
  }
}
