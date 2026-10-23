import { useMutation } from "@tanstack/react-query";
import { sendMagicLink, signOut } from "../services/auth";
import { useNotificationActions } from "../stores/useNotificationStore";

/**Provides the app's sign-in, sign-out mutations.
 *
 * @returns Authentication actions and status:
 *   - `signIn`: Sends a magic-link sign-in email.
 *   - `isSigningIn`: Whether the sign-in request is pending.
 *   - `signInError`: The sign-in error, if the request failed.
 *   - `signInSent`: Whether the sign-in request completed successfully.
 *   - `signOut`: Signs out the current user.
 *   - `isSigningOut`: Whether the sign-out request is pending.
 */
export const useAuth = () => {
  const { show } = useNotificationActions();

  const signInMutation = useMutation({
    mutationFn: (email: string) => sendMagicLink(email, window.location.origin),
    onError: (error) =>
      show(`Couldn't send login link: ${error.message}`, "error"),
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () =>
      show("Signed out - sign in to sync your entries", "success"),
    onError: (error) => show(`Couldn't sign out: ${error.message}`, "error"),
  });

  return {
    signIn: (email: string) => signInMutation.mutate(email),
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSent: signInMutation.isSuccess,
    signOut: () => signOutMutation.mutate(),
    isSigningOut: signOutMutation.isPending,
  };
};
