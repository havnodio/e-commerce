import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: (User & { role?: string }) | null; // Extend User type to include role
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      console.log('AuthContext: Initial getSessionAndProfile called');
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('AuthContext: Initial session fetched:', initialSession ? 'present' : 'null');
      setSession(initialSession);

      if (initialSession?.user) {
        console.log('AuthContext: Fetching profile for user:', initialSession.user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', initialSession.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no row found
          console.error('AuthContext: Error fetching user profile role:', error);
        }
        const userWithRole = { ...initialSession.user, role: profile?.role || 'user' };
        console.log('AuthContext: Initial user with role:', userWithRole ? 'present' : 'null');
        setUser(userWithRole);
      } else {
        console.log('AuthContext: No initial user session, setting user to null.');
        setUser(null);
      }
      setLoading(false);
      console.log('AuthContext: Initial loading set to false');
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log('AuthContext: onAuthStateChange event:', _event, 'newSession:', newSession ? 'present' : 'null');
      setSession(newSession);
      if (newSession?.user) {
        console.log('AuthContext: onAuthStateChange - Fetching profile for user:', newSession.user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', newSession.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('AuthContext: onAuthStateChange - Error fetching user profile role:', error);
        }
        const userWithRole = { ...newSession.user, role: profile?.role || 'user' };
        console.log('AuthContext: onAuthStateChange - User with role:', userWithRole ? 'present' : 'null');
        setUser(userWithRole);
      } else {
        console.log('AuthContext: onAuthStateChange - No user session, setting user to null.');
        setUser(null);
      }
    });

    return () => {
      console.log('AuthContext: Unsubscribing from auth state changes.');
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};