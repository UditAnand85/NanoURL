import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from './Toast';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/signout');
    } catch (_) { /* ignore */ }
    logout();
    toast.success('Signed out successfully!');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#EAE0CB]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#8B3103] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-[#8B3103] tracking-tight">NanoLink</span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <button className="btn-outline text-sm py-2 px-4">Dashboard</button>
              </Link>
              <button onClick={handleLogout} className="btn-primary text-sm py-2 px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-outline text-sm py-2 px-4">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary text-sm py-2 px-4">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
