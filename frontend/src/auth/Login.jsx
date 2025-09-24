import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useApi } from '../lib/api.js';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { json } = useApi();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { ok, data } = await json('post', '/auth/login', { email, password });
      if (!ok) throw new Error(data?.error || 'Login failed');
      login(data.token);
      navigate('/');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      {error && <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" type="submit">Login</Button>
      </form>
    </Card>
  );
}


