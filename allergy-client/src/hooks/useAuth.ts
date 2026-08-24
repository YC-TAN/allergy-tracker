import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }, // to send the user back after they click the link in their email inbox.
  });
  if (error) throw error;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getSession,
    staleTime: Infinity, // Because Supabase auth state is actively managed and synchronized via the event listener, preventing unnecessary refetches via React Query's default background refetching mechanisms.
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(["auth", "user"], session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signInMutation = useMutation({
    mutationFn: (email: string) => sendMagicLink(email),
  });

  const signOutMutation = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => queryClient.clear(), // wipes out any cached user data, preventing sensitive information from lingering in memory.
  });

  return {
    user: result.data,
    isPending: result.isPending,
    signIn: (email: string) => signInMutation.mutate(email),
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSent: signInMutation.isSuccess,
    signOut: () => signOutMutation.mutate(),
  };
};
