import { z } from 'zod'

export const numericString = z.string()
  .min(1, 'Expected numeric string, received empty string')
  .refine(
    str => {
      const number = Number(str)
      return Number.isFinite(number) && !Number.isNaN(number)
    },
    value => ({ message: `Expected numeric string, received '${value}'` })
  )
