import { env } from '@/lib/env'

import { app } from './fastify/app'

async function bootstrap () {
  try {
    await app.listen({ port: env.PORT })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
