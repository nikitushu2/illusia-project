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
  get: (url: string) => Promise<T | null>;
  post: (url: string, body: any) => Promise<T | null>;
  put: (url: string, body: any) => Promise<T | null>;
  patch: (url: string, body: any) => Promise<T | null>;
  remove: (url: string, body: any) => Promise<T | null>;
}

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + "/api";

export const useFetch = <T>(role: ApiRole): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [apiError, setApiError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const fetchData = async (method: string, url: string, body: any): Promise<T | null> => {
    setLoading(true);
    setApiError(null);
    try {
      console.log(`Fetching ${method} ${BACKEND_BASE_PATH}${role}/${url}`);
      const options: RequestInit = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
        credentials: 'include',
      };
      const response = await fetch(`${BACKEND_BASE_PATH}${role}/${url}`, options);
      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        setOk(true);
        const responseData = await response.json() as T;
        console.log(`Response data:`, responseData);
        setData(responseData);
        return responseData;
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
        console.error(`API Error: ${errorMessage} for ${url}`);
        setApiError(errorMessage);
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setApiError(ApiErrorType.SOMETHING_WENT_WRONG);
      return null;
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
