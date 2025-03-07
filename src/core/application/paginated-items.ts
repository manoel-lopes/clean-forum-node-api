export type PaginatedItems<Item = unknown> = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  items: Item[]
}
