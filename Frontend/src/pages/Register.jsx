import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', form);
      login(data.user, data.token);
      toast.success('Account created! Welcome to NanoLink 🎉');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#2d1a0e]">Create Account</h1>
          <p className="text-[#7a6152] mt-1">Join NanoLink for free today</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="input-field"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
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
              <label className="block text-sm font-medium text-[#2d1a0e] mb-1.5">
                Password
                <span className="text-[#7a6152] font-normal ml-1">(min. 6 characters)</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
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
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7a6152] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8B3103] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
