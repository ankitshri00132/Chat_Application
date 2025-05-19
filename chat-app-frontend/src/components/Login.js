import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.message || 'Login failed');
      }

      if (!userData.user || !userData.token) {
        throw new Error('Invalid user data received');
      }

      localStorage.setItem('currentUser', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.token);

      alert('Login Successful');
      navigate('/chat');
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://img.freepik.com/free-vector/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg')] bg-cover bg-center">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-400/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-blue-100">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-700/30">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800/70 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-blue-200/50"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800/70 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-blue-200/50"
              placeholder="Enter your password"
            />
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Sign In
          </motion.button>
        </div>
        
        <div className="mt-6 text-center text-sm text-blue-200">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-300 font-medium hover:text-white hover:underline"
          >
            Sign up
          </Link>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
