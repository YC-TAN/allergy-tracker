import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { getCurrentUser, sendMagicLink, signOut } from "../services/auth";
import { useNotificationActions } from "./useNotificationStore";
import { useSyncEntries } from "./useSyncEntries";

/**
 * React Query key used to cache the currently authenticated user.
 */
export const AUTH_USER_KEY = ["auth", "user"] as const;

/**
 * Provides the app's authentication state and mutation helpers.
 *
 * The current user is cached in React Query and kept synchronized with
 * Supabase authentication events, including sign-in, sign-out, and token
 * refresh events. A successful sign-in also triggers synchronization of local
 * entries with the server.
 *
 * Signing out removes the Supabase session, clears the cached authenticated
 * user, and removes cached entry queries from server. Locally stored entries are retained
 * so unsynced entries can be synchronized after the next sign-in.
 *
 * @returns Authentication state and actions:
 *   - `user`: The current authenticated user, or null.
 *   - `userIsPending`: Whether the current user query is still loading.
 *   - `isSignedIn`: Whether a user is currently signed in.
 *   - `signIn`: Sends a magic-link sign-in email.
 *   - `isSigningIn`: Whether the sign-in request is pending.
 *   - `signInError`: The sign-in error, if the request failed.
 *   - `signInSent`: Whether the sign-in request completed successfully.
 *   - `signOut`: Signs out the current user.
 *   - `isSigningOut`: Whether the sign-out request is pending.
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();
  const { sync } = useSyncEntries();

  const syncRef = useRef(sync);
  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  const result = useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: getCurrentUser,
    /** Supabase auth state is actively managed and synchronized via the event listener,
    * infinity stale time preventing unnecessary refetches via React Query's default background refetching mechanisms 
    */
    staleTime: Infinity,
    
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      queryClient.setQueryData(AUTH_USER_KEY, session?.user ?? null);

      if (event === "SIGNED_IN") {
        syncRef.current();
      }
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signInMutation = useMutation({
    mutationFn: (email: string) => sendMagicLink(email, window.location.origin),
    onError: (error) =>
      show(`Couldn't send login link: ${error.message}`, "error"),
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_USER_KEY, null);
      /** clears stale in-memory server data */
      queryClient.removeQueries({
        queryKey: ["entry"],
      });
      show("Signed out - sign in to sync your entries", "success");
    },
    onError: (error) => show(`Couldn't sign out: ${error.message}`, "error"),
  });

  return {
    user: result.data,
    userIsPending: result.isPending,
    isSignedIn: result.data != null,
    signIn: (email: string) =>
      signInMutation.mutate(email),
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSent: signInMutation.isSuccess,
    signOut: () => signOutMutation.mutate(),
    isSigningOut: signOutMutation.isPending,
  };
};
