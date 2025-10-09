import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: (User & { role?: string }) | null;
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
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const handleAuthChange = async (currentSession: Session | null) => {
      setSession(currentSession);
      if (currentSession?.user) {
        console.log('AuthContext: Fetching profile for user:', currentSession.user.id);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no row found
            console.error('AuthContext: Error fetching user profile role:', error);
          }
          const userWithRole = { ...currentSession.user, role: profile?.role || 'user' };
          console.log('AuthContext: User with role:', userWithRole ? 'present' : 'null');
          setUser(userWithRole);
        } catch (error) {
          console.error('AuthContext: Error in handleAuthChange profile fetch:', error);
          setUser({ ...currentSession.user, role: 'user' }); // Default role on error
        }
      } else {
        console.log('AuthContext: No user session, setting user to null.');
        setUser(null);
      }
      setLoading(false); // Set loading to false after all async operations are done
      console.log('AuthContext: Loading set to false after handleAuthChange.');
    };

    // Initial session check
    const initialLoad = async () => {
      console.log('AuthContext: Initial load started.');
      setLoading(true); // Ensure loading is true at the very start of the effect
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session fetched:', initialSession ? 'present' : 'null');
        await handleAuthChange(initialSession); // Process initial session
      } catch (error) {
        console.error('AuthContext: Error during initial session load:', error);
        setSession(null);
        setUser(null);
        setLoading(false); // Ensure loading is false even if initial fetch fails
      }
    };

    initialLoad();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log('AuthContext: onAuthStateChange event:', _event, 'newSession:', newSession ? 'present' : 'null');
      // For subsequent changes, we don't need to set loading to true again,
      // as the initial load already handled it. Just update session/user.
      await handleAuthChange(newSession);
    });

    return () => {
      console.log('AuthContext: Unsubscribing from auth state changes.');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

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