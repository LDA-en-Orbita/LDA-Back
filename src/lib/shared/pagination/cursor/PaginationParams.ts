export interface PaginationParams<TFilters = unknown> {
  cursor: number;
  limit: number;
  filters?: TFilters;
}
