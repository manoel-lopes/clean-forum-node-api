export type PaginationParams = {
  page?: number
  pageSize?: number
  order?: 'asc' | 'desc'
}

export type CursorPaginationParams = {
  cursor?: string
  pageSize?: number
  order?: 'asc' | 'desc'
}
