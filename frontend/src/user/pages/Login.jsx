import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { email, password, role: "User" },
        { withCredentials: true, timeout: 5000 }
      );

      if (response.data && response.data.user) {
        const { user } = response.data;
        login(user);

        // Show status toasts after login
        try {
          const ordersRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/order/orders`,
            { withCredentials: true }
          );
          const orders = ordersRes.data.orders || [];
          const pending = orders.filter(o => o.status === 'Pending').length;
          const accepted = orders.filter(o => o.status === 'Accepted').length;

          if (accepted > 0) {
            toast.success(`${accepted} donation${accepted > 1 ? 's are' : ' is'} on the way to an NGO!`, { duration: 5000 });
          }
          if (pending > 0) {
            toast(`You have ${pending} pending request${pending > 1 ? 's' : ''} awaiting pickup.`, { icon: '⏳', duration: 5000 });
          }
        } catch (_) { /* non-critical */ }

        navigate('/user/dashboard');
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      let errorMessage = 'Something went wrong';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg">
              <div className="text-white text-4xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            FoodBridge
          </motion.h1>
          <motion.p 
            className="text-teal-700 font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome back to our community
          </motion.p>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
          
          <div className="p-8">
            <motion.h2 
              className="text-2xl font-bold text-center text-gray-800 mb-8"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Login to Your Account
            </motion.h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm"
              >
                <p className="text-red-700 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMail className="mr-2 text-emerald-600" />
                  Email Address
                </label>
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.01 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                    placeholder="your@email.com"
                  />
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                </motion.div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiLock className="mr-2 text-emerald-600" />
                  Password
                </label>
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.01 }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-4 pl-11 pr-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                    placeholder="••••••••"
                  />
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </motion.button>
                </motion.div>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ 
                  scale: 1.02,
                  background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)"
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg ${
                  loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl'
                } transition-all duration-300 relative overflow-hidden`}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    <span className="ml-3">Signing In...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Login to Your Account
                  </span>
                )}
                {!loading && (
                  <motion.span 
                    className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"
                    initial={{ opacity: 0 }}
                  />
                )}
              </motion.button>
            </form>
          </div>
          
          <div className="px-8 py-6 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/user/signin" className="font-semibold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FoodBridge. Bringing communities together through food sharing.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;