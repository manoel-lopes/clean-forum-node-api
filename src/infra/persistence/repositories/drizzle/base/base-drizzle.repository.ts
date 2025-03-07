import type { PgTable, AnyPgColumn } from 'drizzle-orm/pg-core'
import { db } from '@/infra/persistence/drizzle/client'
import { and, eq, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm'

export type FindOptions<Table extends PgTable> = {
  where: Partial<Record<
  keyof InferSelectModel<Table>, InferSelectModel<Table>[keyof InferSelectModel<Table>]>>
}

export abstract class BaseDrizzleRepository<Table extends PgTable> {
  constructor (private readonly table: Table) {}

  async save (entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }

  async findAll (): Promise<InferSelectModel<Table>[]> {
    return db.select().from(sql`${this.table}`).execute() as Promise<InferSelectModel<Table>[]>
  }

  async findOne ({ where }: FindOptions<Table>): Promise<InferSelectModel<Table> | null> {
    const whereClause = Object.entries(where).map(([key, value]) => {
      return eq(this.table[key as keyof Table] as AnyPgColumn, value)
    })

    const result = await db.select()
      .from(sql`${this.table}`)
      .where(and(...whereClause))
      .limit(1)
      .execute() as InferSelectModel<Table>[]

    return result.length > 0 ? result[0] : null
  }
}
