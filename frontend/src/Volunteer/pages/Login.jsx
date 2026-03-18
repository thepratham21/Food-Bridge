import React, { useState, useContext, useEffect } from 'react';
import {
  FiUser,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { email, password, role: "Volunteer" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success && response.data.user) {

        // update auth context
        login(response.data.user);

        // optional local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (rememberMe) {
          localStorage.setItem('volunteerEmail', email);
        } else {
          localStorage.removeItem('volunteerEmail');
        }

        navigate('/volunteer/dashboard');

      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.status === 403) {
          setError('Volunteer account not authorized');
        } else if (err.response.status === 404) {
          setError('User not found');
        } else {
          setError(err.response.data.message || 'An error occurred');
        }
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Request setup error: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('volunteerEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-4">
      <div className="w-full max-w-md">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-6 text-center">

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-white/20 p-4 rounded-full inline-block mb-4"
            >
              <FiUser className="text-white text-3xl" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Volunteer Login
            </h1>

            <p className="text-emerald-100">
              Access your volunteer dashboard
            </p>

          </div>

          {/* Form */}
          <div className="px-8 py-10">

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center"
              >
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="your.email@example.com"
                  />

                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>

                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <a href="/forgot-password" className="text-sm text-emerald-600">
                  Forgot password?
                </a>

              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl flex items-center justify-center"
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Sign in
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>

            </form>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default Login;