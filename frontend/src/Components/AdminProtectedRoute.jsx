import { Navigate } from 'react-router-dom';
import { useAuthContext } from './authContext';

const AdminProtectedRoute = ({ children, redirectTo = '/home' }) => {
  const { auth } = useAuthContext();

  console.log("AdminProtectedRoute - auth:", auth);
  console.log("AdminProtectedRoute - auth.role:", auth?.role);

  // Check if user is authenticated
  if (!auth) {
    console.log("AdminProtectedRoute - No auth, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (auth.role !== 'admin') {
    console.log("AdminProtectedRoute - Not admin, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log("AdminProtectedRoute - Admin access granted");
  return children;
};

export default AdminProtectedRoute;
