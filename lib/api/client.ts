/**
 * API Client
 * Fetch wrapper with authentication, error handling, and retry logic
 */

import { useAuthStore } from "@/lib/store/authStore";
import type { ApiResponse, ApiError } from "@/types/api";
import {
  API_BASE_URL,
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
  RETRY_CONFIG,
} from "./config";

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Extended fetch options
 */
interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Sleep helper for retry delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number, baseDelay: number): number => {
  return baseDelay * Math.pow(2, attempt);
};

/**
 * Check if error should be retried
 */
const shouldRetry = (
  status: number | undefined,
  method: string,
  attempt: number
): boolean => {
  if (attempt >= RETRY_CONFIG.maxRetries) return false;
  if (!method || !RETRY_CONFIG.retryMethods.includes(method.toUpperCase()))
    return false;
  if (!status) return true; // Network error, retry
  return RETRY_CONFIG.retryStatusCodes.includes(status);
};

/**
 * Make fetch request with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Core fetch function with retry logic
 */
async function fetchWithRetry(
  url: string,
  options: FetchOptions,
  attempt = 0
): Promise<Response> {
  try {
    const timeout = options.timeout || REQUEST_TIMEOUT;
    const response = await fetchWithTimeout(url, options, timeout);

    // If response is OK or shouldn't retry, return it
    if (
      response.ok ||
      !shouldRetry(response.status, options.method || "GET", attempt)
    ) {
      return response;
    }

    // Retry with exponential backoff
    const delay = getRetryDelay(attempt, RETRY_CONFIG.retryDelay);
    await sleep(delay);
    return fetchWithRetry(url, options, attempt + 1);
  } catch (error) {
    // Network error or timeout
    if (
      shouldRetry(undefined, options.method || "GET", attempt) &&
      (error instanceof DOMException || error instanceof TypeError)
    ) {
      const delay = getRetryDelay(attempt, RETRY_CONFIG.retryDelay);
      await sleep(delay);
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw error;
  }
}

/**
 * Process fetch response and handle errors
 */
async function processResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    // Try to parse error response
    if (isJson) {
      const errorData: ApiError = await response.json();

      // Handle 401 Unauthorized - auto logout
      if (response.status === 401) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      throw new ApiClientError(
        errorData.message || "API request failed",
        response.status,
        errorData.errors
      );
    }

    // Non-JSON error
    const text = await response.text();
    throw new ApiClientError(text || response.statusText, response.status);
  }

  // Parse successful response
  if (isJson) {
    const jsonData = await response.json();

    // Check if this is a paginated response (has meta.pagination)
    if (jsonData.meta?.pagination) {
      // Return the entire response for paginated endpoints
      return jsonData as T;
    }

    // For regular API responses, extract the data field
    const data: ApiResponse<T> = jsonData;
    return data.data;
  }

  // Non-JSON successful response (shouldn't happen with our API)
  return (await response.text()) as unknown as T;
}

/**
 * Build request headers with authentication
 */
function buildHeaders(skipAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = { ...DEFAULT_HEADERS };

  if (!skipAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Build full URL
 */
function buildUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}

/**
 * API Client object with methods for different HTTP verbs
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = buildHeaders(options.skipAuth);

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers,
      ...options,
    });

    return processResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = buildHeaders(options.skipAuth);

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return processResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = buildHeaders(options.skipAuth);

    const response = await fetchWithRetry(url, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return processResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = buildHeaders(options.skipAuth);

    const response = await fetchWithRetry(url, {
      method: "DELETE",
      headers,
      ...options,
    });

    return processResponse<T>(response);
  },

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const token = useAuthStore.getState().token;

    const headers: HeadersInit = {};
    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers,
      body: formData,
      ...options,
    });

    return processResponse<T>(response);
  },

  /**
   * PUT request with FormData (for file uploads)
   */
  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const token = useAuthStore.getState().token;

    const headers: HeadersInit = {};
    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetchWithRetry(url, {
      method: "PUT",
      headers,
      body: formData,
      ...options,
    });

    return processResponse<T>(response);
  },
};
