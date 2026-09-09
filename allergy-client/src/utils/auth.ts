import type { QueryClient } from "@tanstack/react-query";
import { AUTH_USER_KEY } from "../hooks/useAuth";

export const checkIsSignedIn = (queryClient: QueryClient) =>
  queryClient.getQueryData(AUTH_USER_KEY) != null;