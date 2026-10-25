import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

/** Authentication state shared by the client application. */
interface AuthState {
    /** The currently authenticated Supabase user, or null when signed out. */
    user: User | null
    /** Whether the initial authentication state is still being resolved. */
    loading: boolean
    actions: {
        /** Stores the current user and marks initial authentication as complete. */
        setUser: (user: User | null) => void;
    }
}

/**
 * Global state manager for current user and loading.
 * Holds identity information and exposes actions to mutate user sessions.
 */
const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true, // true until the first auth event arrive
    actions: {
        setUser: (user) => {
            set({user, loading: false});
        }
    } 
}));

export default useAuthStore;

/**
 * Selects the currently authenticated user from the auth store.
 *
 * @returns The id of authenticated user, or null when no user is signed in.
 */
export const useUserId = () => useAuthStore((s) => s.user?.id);

/**
 * Selects the initial authentication loading state from the auth store.
 *
 * @returns Whether the initial authentication state is still loading.
 */
export const useAuthLoading = () => useAuthStore((s) => s.loading);

/**
 * Selects whether a user is currently signed in.
 *
 * @returns True once auth has resolved and a user exists.
 */
export const useIsSignedIn = () =>
  useAuthStore((s) => !s.loading && s.user != null);

/**
 * Selects authentication actions from the auth store.
 *
 * @returns The actions used to update authentication state.
 */
export const useAuthActions = () => useAuthStore((s) => s.actions);