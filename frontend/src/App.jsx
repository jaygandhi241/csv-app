import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Upload from './pages/Upload.jsx';
import Records from './pages/Records.jsx';
import Button from './components/Button.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  const { token, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link to="/" className="font-semibold text-indigo-600">CSV App</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/upload" className="hover:text-indigo-600">Upload</Link>
              <Link to="/records" className="hover:text-indigo-600">Records</Link>
            </nav>
            <div className="ml-auto">
              {token ? (
                <Button onClick={logout}>Logout</Button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="text-sm hover:text-indigo-600">Login</Link>
                  <Link to="/register" className="text-sm hover:text-indigo-600">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Welcome to CSV App</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}


