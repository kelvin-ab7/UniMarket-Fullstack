import { Navigate } from 'react-router-dom';
import { useAuthContext } from './authContext';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { auth } = useAuthContext();

  if (!auth) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
