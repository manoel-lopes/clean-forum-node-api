import { z } from 'zod'

export const createAccountRequestSchema = {
  body: z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .max(6)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase and one lowercase letter, ' +
      'one number and one special character'
      ),
  }),
}
