import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const envKey = (import.meta as any).env?.VITE_ADMIN_KEY || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check for hardcoded credentials first.
    if (username === 'admin' && password === '123') {
      if (!envKey) return setError('VITE_ADMIN_KEY is not set in your .env file.');
      sessionStorage.setItem('UTSAV_ADMIN_KEY', envKey);
      navigate('/admin');
      return;
    }

    setError('Invalid username or password');
  };

  const useEnvKey = () => {
    if (!envKey) return setError('No VITE_ADMIN_KEY set in environment');
    sessionStorage.setItem('UTSAV_ADMIN_KEY', envKey);
    navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow mt-12">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center space-x-2">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Sign in</button>
          <button type="button" onClick={useEnvKey} className="px-3 py-2 border rounded">Use VITE_ADMIN_KEY</button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-600">Use username <code>admin</code> and password <code>123</code>. To logout, run <code>sessionStorage.removeItem('UTSAV_ADMIN_KEY')</code>.</p>
    </div>
  );
};

export default AdminLogin;
