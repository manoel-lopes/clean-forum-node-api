export type PaginatedItems<Item> = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  items: Item[]
  order: 'asc' | 'desc'
}

export type CursorPaginatedItems<Item> = {
  cursor: string | null
  nextCursor: string | null
  pageSize: number
  totalItems: number
  hasMore: boolean
  items: Item[]
  order: 'asc' | 'desc'
}
