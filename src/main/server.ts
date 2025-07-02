import { env } from '@/lib/env'
import { app } from './config/app'

app.listen({ port: env.PORT })
