import { Entity } from '@/core/domain/entity'
import { BaseCachedMapper } from './base-cached-mapper'

class TestEntity extends Entity {
  public title: string

  constructor (title: string, id?: string) {
    super(id)
    this.title = title
  }
}

class TestMapper extends BaseCachedMapper {
  static testToPaginated (cache: string, toDomain: (cache: string) => TestEntity[]): unknown {
    return this.toPaginated(cache, toDomain)
  }
}

describe('BaseCachedMapper', () => {
  describe('toPersistence', () => {
    it('should stringify single item', () => {
      const entity = new TestEntity('test')

      const result = BaseCachedMapper.toPersistence(entity)

      expect(result).toBe(JSON.stringify(entity))
    })

    it('should stringify array of items', () => {
      const entities = [
        new TestEntity('test1'),
        new TestEntity('test2')
      ]

      const result = BaseCachedMapper.toPersistence(entities)

      expect(result).toBe(JSON.stringify(entities))
    })
  })

  describe('toPaginatedPersistence', () => {
    it('should stringify paginated items', () => {
      const paginatedItems = {
        items: [new TestEntity('test')],
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        order: 'desc' as const
      }

      const result = BaseCachedMapper.toPaginatedPersistence(paginatedItems)

      expect(result).toBe(JSON.stringify(paginatedItems))
    })
  })

  describe('toPaginated', () => {
    const mockToDomain = (cache: string): TestEntity[] => {
      const items = JSON.parse(cache)
      return items.map((item: { title: string; id: string }) => new TestEntity(item.title, item.id))
    }

    it('should convert valid paginated cache', () => {
      const paginatedData = {
        items: [{ id: 'test-id', title: 'Test' }],
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        order: 'desc'
      }
      const cache = JSON.stringify(paginatedData)

      const result = TestMapper.testToPaginated(cache, mockToDomain)

      expect(result.items).toHaveLength(1)
      expect(result.items[0]).toBeInstanceOf(TestEntity)
      expect(result.items[0].title).toBe('Test')
      expect(result.page).toBe(1)
      expect(result.totalItems).toBe(1)
    })

    it('should return default empty result for invalid cache', () => {
      const invalidCache = JSON.stringify({ invalidField: 'test' })

      const result = TestMapper.testToPaginated(invalidCache, mockToDomain)

      expect(result.items).toEqual([])
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(0)
      expect(result.totalItems).toBe(0)
      expect(result.totalPages).toBe(0)
      expect(result.order).toBe('desc')
    })
  })
})
