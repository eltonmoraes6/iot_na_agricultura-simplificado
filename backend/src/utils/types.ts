export interface QueryOptions {
  filters?: { [key: string]: any };
  sort?: { field: string; order: 'ASC' | 'DESC' };
  pagination?: { page: number; limit: number };
  fields?: string[];
}
