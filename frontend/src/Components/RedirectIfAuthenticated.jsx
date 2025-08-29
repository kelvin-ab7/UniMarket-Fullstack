import { Navigate } from 'react-router-dom';
import { useAuthContext } from './authContext';

const RedirectIfAuthenticated = ({ children, redirectTo = '/home' }) => {
  const { auth } = useAuthContext();

  // If user is authenticated, redirect them away from public pages
  if (auth) {
    // If user is admin, redirect to admin dashboard
    if (auth.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Otherwise redirect to home
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
