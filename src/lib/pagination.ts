export const MAX_PAGE_SIZE = 100

export function sanitizePagination (page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const safePageSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE)
  return {
    page: safePage,
    pageSize: safePageSize,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize
  }
}
