import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react'; // Import useEffect

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute: session:', session ? 'present' : 'null', 'loading:', loading);
  }, [session, loading]);

  if (loading) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }

  if (!session) {
    console.log('ProtectedRoute: No session, navigating to /login');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;