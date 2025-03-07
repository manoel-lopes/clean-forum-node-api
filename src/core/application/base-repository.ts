export type BaseRepository<Entity> = {
  save: (entity: Entity) => Promise<void>
  findById(entityId: string): Promise<Entity | null>
  delete(entityId: string): Promise<void>
}
