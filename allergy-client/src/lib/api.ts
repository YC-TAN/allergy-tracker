import { supabase } from "../lib/supabase";
import { ApiError } from "./error";

/** Base path for backend API requests. */
const API_URL = "/api";

/**
 * Sends an API request and includes the current Supabase access token when available.
 *
 * The token is retrieved each time this function is called.
 * @param path API endpoint path.
 * @param options Optional fetch request settings.
 * @returns The parsed API response.
 * @throws ApiError When the request fails.
 */
const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.detail ?? "Request failed");
  }

  return response.json();
};

export default apiFetch;
