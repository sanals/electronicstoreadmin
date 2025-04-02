export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface HealthStatus {
  status: "UP" | "DOWN";
  components: {
    [key: string]: {
      status: "UP" | "DOWN";
      details?: Record<string, any>;
    };
  };
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  autoHideDuration?: number;
} 