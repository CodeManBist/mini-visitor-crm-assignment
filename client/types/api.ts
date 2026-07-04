export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pages: number;
  data: T[];
}

export interface ApiErrorPayload {
  message: string;
  statusCode?: number;
  errors?: Array<{
    msg: string;
    path?: string;
    value?: unknown;
  }>;
}