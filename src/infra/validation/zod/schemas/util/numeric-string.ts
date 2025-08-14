import { z } from 'zod'

export const numericString = z.coerce.number().pipe(z.number())
