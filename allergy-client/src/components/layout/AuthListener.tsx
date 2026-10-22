import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuthActions } from "../../stores/useAuthStore";

export const AuthListener = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthActions();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [queryClient, setUser]);

  return null;
}
