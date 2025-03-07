import { env } from '@/lib/env'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: env.NODE_ENV !== 'production',
  entities: ['src/infra/persistence/typeorm/data-mappers/**/*.mapper.ts'],
  migrations: ['src/infra/persistence/typeorm/migrations/*.ts'],
})

AppDataSource.initialize()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
