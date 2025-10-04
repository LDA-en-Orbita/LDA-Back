export interface StandardResponse<T = unknown> {
  status: number;
  data: T | null;
  errors: unknown | null;
  timestamp: string;
}
