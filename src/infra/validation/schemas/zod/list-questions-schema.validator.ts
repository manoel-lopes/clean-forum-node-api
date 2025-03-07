import {
  listQuestionsRequestSchema,
} from '@/external/zod/application/list-questions/list-questions-request.schema'
import { BaseListItemsSchemaValidator } from './base/base-list-items-schema.validator'

export class ListQuestionsSchemaValidator extends BaseListItemsSchemaValidator {
  constructor () {
    super(listQuestionsRequestSchema)
  }
}
