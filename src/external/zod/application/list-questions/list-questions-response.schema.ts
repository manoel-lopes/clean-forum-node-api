import { questionSchema } from '@/external/zod/domain/question.schema'
import { errorResponseSchema } from '@/external/zod/application/errors/error-response.schema'
import {
  createPaginatedResponseSchema,
} from '@/external/zod/util/functions/create-paginated-response-schema'

export const listQuestionsResponseSchema = {
  200: createPaginatedResponseSchema(questionSchema),
  422: errorResponseSchema,
  500: errorResponseSchema,
}
