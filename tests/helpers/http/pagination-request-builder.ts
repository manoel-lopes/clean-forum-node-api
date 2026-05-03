type Order = 'asc' | 'desc'

type PaginationQuery = {
  page: number
  pageSize: number
  order: Order
}

type PaginationWithIncludeQuery = PaginationQuery & {
  include?: ('comments' | 'attachments' | 'author')[]
}

export function makeHttpFetchRequest (
  page: number,
  pageSize: number,
  order: Order = 'desc'
): { query: PaginationQuery } {
  return { query: { page, pageSize, order } }
}

function singleIncludeOption (value: string): ('comments' | 'attachments' | 'author')[] {
  if (value === 'comments' || value === 'attachments' || value === 'author') {
    return [value]
  }
  throw new Error(`invalid include: ${value}`)
}

export function makeHttpFetchRequestWithParams<P extends Record<string, string>> (
  params: P,
  page: number,
  pageSize: number,
  order: Order = 'desc',
  include?: string | ('comments' | 'attachments' | 'author')[]
): { params: P; query: PaginationWithIncludeQuery } {
  const query: PaginationWithIncludeQuery = { page, pageSize, order }
  if (include !== undefined) {
    query.include = typeof include === 'string' ? singleIncludeOption(include) : include
  }
  return { params, query }
}
