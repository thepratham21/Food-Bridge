import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../main';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/login',
        { email, password, role: "NGO" },
        { withCredentials: true, timeout: 5000 }
      );

      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate('/');
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      let errorMessage = 'Something went wrong';
      
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // No response received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other errors
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500 p-3 rounded-full">
              <TbTruckDelivery className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FoodShare</h1>
          <p className="text-emerald-600 font-medium">NGO Login</p>
        </div>

        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="px-8 py-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login to Your Account</h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMail className="mr-2 text-emerald-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiLock className="mr-2 text-emerald-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-4 pl-11 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="mb-6 text-right">
                <Link to="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all ${
                  loading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Login'
                )}
              </motion.button>
            </form>
          </div>
          
          <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signin" className="font-semibold text-emerald-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FoodShare. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

// Add this component if missing
const TbTruckDelivery = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

export default Login;