import { z } from 'zod'

type EnvParseErrorMap = { _errors: string[] }
type EnvErrorDetails = EnvParseErrorMap | string[]
type EnvParseError = [string, EnvErrorDetails]

const _env = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z
      .string()
      .default('3333')
      .transform((port) => Number(port)),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string().transform((port) => Number(port)),
    DB_NAME: z.string(),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z
      .string()
      .default('6379')
      .transform((port) => Number(port)),
    REDIS_DB:
    z.string()
      .default('0')
      .transform((db) => Number(db)),
  })
  .safeParse(process.env)

if (!_env.success) {
  const errors: EnvParseError[] = Object.entries(_env.error.format())
  const formattedErrors = formatErrors(errors)
  logEnvErrors(formattedErrors)
  process.exit(1)
}

function formatErrors (errors: EnvParseError[]) {
  return errors
    .filter(([_, value]) => '_errors' in value)
    .map(([key]) => `${key} is required`)
}

function logEnvErrors (errors: string[]): void {
  console.error('\n\x1b[1m\x1b[31m❌ Invalid environment variables:\x1b[0m')
  errors.forEach((error) => console.error(`- ${error}`))
}

export const env = _env.data
