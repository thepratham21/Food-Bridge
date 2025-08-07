import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SignIn = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'User',
    pincode: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        alert('User registered successfully!');
        navigate('/');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering user. Please try again.');
      console.error(error);
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
        className="w-full max-w-4xl"
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
            FoodShare
          </motion.h1>
          <motion.p 
            className="text-teal-700 font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Join our community of food sharing
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
              Create Your Account
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-emerald-600" />
                    First Name
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="John"
                    />
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiUser className="mr-2 text-emerald-600" />
                    Last Name
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="Doe"
                    />
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div className="md:col-span-2">
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="your@email.com"
                    />
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiPhone className="mr-2 text-emerald-600" />
                    Phone Number
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="(123) 456-7890"
                    />
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="mr-2 text-emerald-600" />
                    Pincode
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="12345"
                    />
                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="mr-2 text-emerald-600" />
                    Full Address
                  </label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full p-4 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm transition-all"
                      placeholder="123 Main St, City, State"
                    />
                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  </motion.div>
                </div>
                
                <div className="md:col-span-2">
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
              </div>

              <div className="mt-8">
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
                      <span className="ml-3">Creating Account...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create Account
                    </span>
                  )}
                  {!loading && (
                    <motion.span 
                      className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"
                      initial={{ opacity: 0 }}
                    />
                  )}
                </motion.button>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <a 
                    href="/" 
                    className="font-semibold text-emerald-600 hover:text-emerald-800 hover:underline transition-colors"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FoodShare. Bringing communities together through food sharing.
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;