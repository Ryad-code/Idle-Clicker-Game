import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  // undefined → still loading, null → not logged in, User → logged in
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Step 1: fetch current user
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    }

    fetchUser();

    // Step 2: listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Step 3: cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
