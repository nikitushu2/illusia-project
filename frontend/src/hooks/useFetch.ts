import { useState, useCallback } from "react";

export enum ApiErrorType {
    UNAUTHORIZED_USER = "Unauthorized user",
    BAD_REQUEST = "Bad request",
    NOT_FOUND = "Not found",
    INTERNAL_SERVER_ERROR = "Internal server error",
    SOMETHING_WENT_WRONG = "Something went wrong",
    CONFLICT = "Conflict",
}

export enum ApiRole {
    PUBLIC = "",
    PRIVATE = "/private",
    ADMIN = "/private/admin",
}

interface FetchState<T> {
  data: T | null;
  ok: boolean;
  apiError: ApiErrorType | null;
  loading: boolean;
  get: (url: string) => Promise<void>;
  post: (url: string, body: any) => Promise<void>;
  put: (url: string, body: any) => Promise<void>;
  patch: (url: string, body: any) => Promise<void>;
  remove: (url: string, body: any) => Promise<void>;
}

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + "/api";

export const useFetch = <T>(role: ApiRole): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [apiError, setApiError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const fetchData = async (method: string, url: string, body: any) => {
    setLoading(true);
    setApiError(null);
    try {
      const options: RequestInit = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
      };
      const response = await fetch(`${BACKEND_BASE_PATH}${role}/${url}`, options);
      if (response.ok) {
        setOk(true);
        const text = await response.text();
        const data = text ? (JSON.parse(text) as T) : null;
        setData(data);
      } else {
        let errorMessage: ApiErrorType;
        switch (response.status) {
          case 400:
            errorMessage = ApiErrorType.BAD_REQUEST;
            break;
          case 401:
            errorMessage = ApiErrorType.UNAUTHORIZED_USER;
            break;
          case 404:
            errorMessage = ApiErrorType.NOT_FOUND;
            break;
          case 409:
            errorMessage = ApiErrorType.CONFLICT;
            break;
          case 500:
            errorMessage = ApiErrorType.INTERNAL_SERVER_ERROR;
            break;
          default:
            errorMessage = ApiErrorType.SOMETHING_WENT_WRONG;
        }
        setApiError(errorMessage);
      }
    } catch (error) {
      setApiError(ApiErrorType.SOMETHING_WENT_WRONG);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const get = useCallback((url: string) => fetchData("GET", url, null), []);
  const post = useCallback((url: string, body: any) => fetchData("POST", url, body), []);
  const put = useCallback((url: string, body: any) => fetchData("PUT", url, body), []);
  const patch = useCallback((url: string, body: any) => fetchData("PATCH", url, body), []);
  const remove = useCallback((url: string, body: any) => fetchData("DELETE", url, body), []);

  return { data, ok, apiError, loading, get, post, put, patch, remove };
}
