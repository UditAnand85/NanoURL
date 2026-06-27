import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signin', form);
      login(data.user, data.token);
      toast.success('Welcome back! 🎉');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#8B3103] flex items-center justify-center shadow-lg mx-auto mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#2d1a0e]">Welcome back</h1>
          <p className="text-[#7a6152] mt-1">Sign in to your NanoLink account</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="input-field"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a6152] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#8B3103] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
