import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deactivated from './pages/Deactivated';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/deactivated" element={<Deactivated />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
                <p className="text-8xl font-extrabold text-[#8B3103]/20 mb-4">404</p>
                <h1 className="text-2xl font-bold text-[#2d1a0e] mb-2">Page not found</h1>
                <p className="text-[#7a6152] mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary px-6 py-2.5">Go Home</a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
