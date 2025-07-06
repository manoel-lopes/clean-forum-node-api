import { app } from './fastify/app'

import { env } from '@/lib/env'

async function bootstrap () {
  try {
    await app.listen({ port: env.PORT })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
