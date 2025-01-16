import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children, redirectTo = '/login' }) => {
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
