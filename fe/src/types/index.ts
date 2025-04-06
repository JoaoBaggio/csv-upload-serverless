
export interface User {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type FilterField = "email" | "first_name" | "last_name";

export interface UserApiResponse {
  items: User[];
  lastKey: string | null;
}

export interface FilterParams {
  field?: FilterField;
  value?: string;
  limit: number;
  lastKey?: string;
}

// Add this type for the mock API
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
