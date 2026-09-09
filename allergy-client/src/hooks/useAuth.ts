import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useNotificationActions } from "./useNotificationStore";
import { useSyncEntries } from "./useSyncEntries";

/**
 * Reads the current Supabase session and returns the authenticated user.
 *
 * @returns The current user object, or null if no active session exists.
 */
async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/**
 * Sends a Supabase magic-link sign-in request for the provided email.
 *
 * @param email The email address that should receive the sign-in link.
 * @throws {Error} When Supabase rejects the requested OTP delivery.
 */
async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { 
      // to send the user back after they click the link in their email inbox.
      emailRedirectTo: window.location.origin 
    }, 
  });
  if (error) throw error;
}

/**
 * React Query key used to cache the currently authenticated user.
 */
export const AUTH_USER_KEY = ["auth", "user"] as const;

/**
 * Provides the App's authentication state and mutation helpers.
 *
 * The hook keeps the user query synchronized with Supabase auth events and
 * triggers an entry sync after a successful sign-in event.
 *
 * @returns An auth object containing the signed-in user,
 *         loading flags, sign-in/sign-out actions, and notification state.
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
    queryFn: getSession,
    staleTime: Infinity, 
    // Because Supabase auth state is actively managed and synchronized via the event listener, 
    // preventing unnecessary refetches via React Query's default background refetching mechanisms.
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      queryClient.setQueryData(["auth", "user"], session?.user ?? null);

      if (event === "SIGNED_IN") {
        syncRef.current();
      }
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signInMutation = useMutation({
    mutationFn: (email: string) => sendMagicLink(email),
    onSuccess: () => show("Check your email for sign-in link", "success"),
    onError: (error) => show(`Couldn't send login link: ${error.message}`, "error"),
  });

  const signOutMutation = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      queryClient.clear();
      show("Signed out - sign in to sync your entries", "success");
    },
    onError: (error) => show(`Couldn't sign out: ${error.message}`, "error")
  });

  return {
    user: result.data,
    userIsPending: result.isPending,
    isSignedIn: result.data != null,
    signIn: (email: string) => signInMutation.mutate(email),
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSent: signInMutation.isSuccess,
    signOut: () => signOutMutation.mutate(),
    isSigningOut: signOutMutation.isPending
  };
};
