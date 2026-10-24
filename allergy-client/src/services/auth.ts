import { supabase } from "../lib/supabase";

/**
 * Sends a passwordless sign-in link to an email address.
 *
 * @param email The email address that should receive the sign-in link.
 * @param emailRedirectTo The URL where the user should return after signing in.
 * @throws When Supabase rejects the sign-in request.
 */
export const sendMagicLink = async (
  email: string,
  emailRedirectTo: string,
): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  });

  if (error) throw error;
}

/**
 * Signs the current user out and removes the Supabase session.
 *
 * @throws When Supabase rejects the sign-out request.
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
