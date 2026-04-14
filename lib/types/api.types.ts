export interface APIError {
  message: string;
  status: number;
}

export type APIResult<T> = 
  | { data: T; error: null }
  | { data: null; error: APIError };
