import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

function generateUniqueDatabaseURL (schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()
let prisma: PrismaClient
beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
    stdio: 'ignore',
  })
  const pool = new pg.Pool({ connectionString: databaseURL })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
})
afterAll(async () => {
  if (prisma) {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
  }
})
