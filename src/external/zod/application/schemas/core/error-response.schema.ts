import { z } from 'zod'

export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
})

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>
