import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#8B3103] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
