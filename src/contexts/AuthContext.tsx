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
    const processSession = async (currentSession: Session | null) => {
      console.log('AuthContext: processSession called with session:', currentSession ? 'present' : 'null');
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
            // Even if profile fetch fails, we still have the user object
            setUser({ ...currentSession.user, role: 'user' }); 
          } else if (profile) {
            const userWithRole = { ...currentSession.user, role: profile.role || 'user' };
            console.log('AuthContext: User with role:', userWithRole ? 'present' : 'null');
            setUser(userWithRole);
          } else {
            // No profile found, but user exists
            setUser({ ...currentSession.user, role: 'user' });
          }
        } catch (error) {
          console.error('AuthContext: Unexpected error during profile fetch:', error);
          setUser({ ...currentSession.user, role: 'user' }); // Default role on unexpected error
        }
      } else {
        console.log('AuthContext: No user session, setting user to null.');
        setUser(null);
      }
      setLoading(false); // Always set loading to false after processing
      console.log('AuthContext: Loading set to false after processSession.');
    };

    // Initial load
    const initializeAuth = async () => {
      console.log('AuthContext: initializeAuth started.');
      setLoading(true); // Ensure loading is true at the very start
      try {
        const { data: { session: initialSession }, error: getSessionError } = await supabase.auth.getSession();
        if (getSessionError) {
          console.error('AuthContext: Error getting initial session:', getSessionError);
          await processSession(null); 
        } else {
          await processSession(initialSession);
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error during initializeAuth:', error);
        await processSession(null); // Ensure loading is false even if initial fetch fails
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log('AuthContext: onAuthStateChange event:', _event, 'newSession:', newSession ? 'present' : 'null');
      // Removed setLoading(true) here. The initialLoad already handles the loading state.
      // This listener should primarily react to changes, not re-initiate a loading state
      // unless it's a specific event like SIGNED_OUT that requires a UI loading state.
      await processSession(newSession);
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