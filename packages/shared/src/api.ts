// Shared API response shapes used by both apps/api and apps/web

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

// Job status SSE event payload
export interface JobStatusEvent {
  jobId: string;
  type: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress?: number; // 0–100
  message?: string;
  result?: unknown;
  errorMessage?: string;
}
