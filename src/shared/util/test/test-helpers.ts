/* eslint-disable @typescript-eslint/consistent-type-assertions */
export async function expectEntityToBeDeleted<T extends { id: string }>(
  repository: { findById: (id: string) => Promise<T | null> },
  entityId: string,
): Promise<void> {
  const deletedEntity = await repository.findById(entityId)
  expect(deletedEntity).toBeNull()
}

export async function expectToThrowResourceNotFound(
  operation: () => Promise<unknown>,
  resourceType: string,
): Promise<void> {
  await expect(operation()).rejects.toThrow(`${resourceType} not found`)
}

export async function expectToThrowNotAuthor(operation: () => Promise<unknown>, resourceType: string): Promise<void> {
  await expect(operation()).rejects.toThrow(`The user is not the author of the ${resourceType}`)
}

export function expectEntityToMatch<T extends object>(
  actual: T,
  expected: Partial<T>,
  options: {
    checkTimestamps?: boolean
    checkId?: boolean
  } = {},
): void {
  const { checkTimestamps = true, checkId = true } = options
  for (const [key, value] of Object.entries(expected)) {
    expect(actual[key as keyof T]).toBe(value)
  }
  if (checkId && 'id' in actual) {
    expect((actual as { id: unknown }).id).toBeDefined()
  }
  if (checkTimestamps) {
    if ('createdAt' in actual) {
      expect((actual as { createdAt: unknown }).createdAt).toBeInstanceOf(Date)
    }
    if ('updatedAt' in actual) {
      expect((actual as { updatedAt: unknown }).updatedAt).toBeInstanceOf(Date)
    }
  }
}

export async function createAndSave<T>(
  factory: (props?: Partial<T>) => T,
  repository: { create: (entity: T) => Promise<T | void> },
  props?: Partial<T>,
): Promise<T> {
  const entity = factory(props)
  await repository.create(entity)
  return entity
}

export async function createMultipleEntities<T>(
  factory: (props?: Partial<T>) => T,
  repository: { create: (entity: T) => Promise<T | void> },
  count: number,
  props?: Partial<T>,
): Promise<T[]> {
  const entities = Array.from({ length: count }, () => factory(props))
  for (const entity of entities) {
    await repository.create(entity)
  }
  return entities
}

export function expectPaginatedResponse<T>(
  response: {
    items: T[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  },
  expected: {
    page: number
    pageSize: number
    itemsLength: number
    minTotalItems?: number
    exactTotalItems?: number
    minTotalPages?: number
    exactTotalPages?: number
  },
): void {
  expect(response.items).toHaveLength(expected.itemsLength)
  expect(response.page).toBe(expected.page)
  expect(response.pageSize).toBe(expected.pageSize)
  if (expected.exactTotalItems !== undefined) {
    expect(response.totalItems).toBe(expected.exactTotalItems)
  } else if (expected.minTotalItems !== undefined) {
    expect(response.totalItems).toBeGreaterThanOrEqual(expected.minTotalItems)
  }
  if (expected.exactTotalPages !== undefined) {
    expect(response.totalPages).toBe(expected.exactTotalPages)
  } else if (expected.minTotalPages !== undefined) {
    expect(response.totalPages).toBeGreaterThanOrEqual(expected.minTotalPages)
  }
}

export function expectEmptyPaginatedResponse<T>(
  response: {
    items: T[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  },
  page: number,
  pageSize: number,
): void {
  expect(response.items).toHaveLength(0)
  expect(response.page).toBe(page)
  expect(response.pageSize).toBe(pageSize)
  expect(response.totalItems).toBe(0)
  expect(response.totalPages).toBe(0)
}
