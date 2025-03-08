import type { PgTable, AnyPgColumn } from 'drizzle-orm/pg-core'
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { db } from '@/infra/persistence/drizzle/client'

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
    return db
      .select()
      .from(this.table as PgTable)
      .execute() as Promise<InferSelectModel<Table>[]>
  }

  async findOne ({ where }: FindOptions<Table>): Promise<InferSelectModel<Table> | null> {
    const whereClause = Object.entries(where).map(([key, value]) => {
      return eq(this.table[key as keyof Table] as AnyPgColumn, value)
    })

    const [entity] = await db.select()
      .from(this.table as PgTable)
      .where(and(...whereClause))
      .limit(1)
      .execute() as InferSelectModel<Table>[]

    return entity ?? null
  }

  async deleteOne ({ where }: FindOptions<Table>): Promise<void> {
    const whereClause = Object.entries(where).map(([key, value]) => {
      return eq(this.table[key as keyof Table] as AnyPgColumn, value)
    })

    await db.delete(this.table)
      .where(and(...whereClause))
      .execute()
  }

  async updateOne (
    { where }: FindOptions<Table>,
    data: Partial<InferSelectModel<Table>>
  ): Promise<InferSelectModel<Table>> {
    const whereClause = Object.entries(where).map(([key, value]) => {
      return eq(this.table[key as keyof Table] as AnyPgColumn, value)
    })

    const [updatedEntity] = await db.update(this.table)
      .set(data as Record<string, unknown>)
      .where(and(...whereClause))
      .returning()
      .execute() as InferSelectModel<Table>[]

    return updatedEntity
  }
}
