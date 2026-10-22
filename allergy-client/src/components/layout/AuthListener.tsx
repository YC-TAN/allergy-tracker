import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuthActions } from "../../stores/useAuthStore";

export const AuthListener = () => {
  const { setUser } = useAuthActions();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return null;
}
