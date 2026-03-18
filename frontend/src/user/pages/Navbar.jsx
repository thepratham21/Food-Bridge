import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaHome, 
  FaHandHoldingHeart, 
  FaHistory, 
  FaUser, 
  FaBell, 
  FaSearch,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext"; // new context
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // use logout
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      logout(); // call context logout
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const isAuthenticated = Boolean(user);

  // Sample notifications data
  const notifications = [
    { id: 1, text: "Your donation request has been accepted", time: "2 hours ago", read: false },
    { id: 2, text: "New volunteer opportunity available", time: "1 day ago", read: true },
    { id: 3, text: "Thank you for your recent donation", time: "3 days ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation items
  const navItems = [
    { path: "/user/dashboard", icon: <FaHome />, label: "Home" },
    { path: "/user/donate", icon: <FaHandHoldingHeart />, label: "Donate" },
    { path: "/user/history", icon: <FaHistory />, label: "History" },
  ];

  return (
    <>
      {isAuthenticated && (
        <header className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <NavLink to="/" className="flex items-center">
                <div className="bg-white p-2 rounded-full mr-3">
                  <FaHandHoldingHeart className="text-emerald-600 text-xl" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold">FoodShare</h1>
              </NavLink>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.path}
                    to={item.path}
                    className={({isActive}) => 
                      `px-4 py-2 rounded-lg flex items-center transition ${
                        isActive 
                          ? 'bg-white text-emerald-600 font-medium shadow-md' 
                          : 'hover:bg-emerald-700'
                      }`
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Right Side Icons */}
              <div className="flex items-center space-x-4">
                {/* Search Button */}
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full hover:bg-emerald-700"
                >
                  <FaSearch className="text-xl" />
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full hover:bg-emerald-700 relative"
                  >
                    <FaBell className="text-xl" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="font-bold text-gray-800">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                            >
                              <p className="text-gray-800">{notification.text}</p>
                              <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-gray-50 text-center">
                          <button className="text-emerald-600 font-medium hover:underline">
                            View All Notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User Profile */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                    <span className="hidden md:inline font-medium">
                      {user?.firstName || "User"}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <p className="font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-600 text-sm truncate">{user?.email}</p>
                        </div>
                        <ul>
                          <li>
                            <NavLink 
                              to="/profile" 
                              className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                              onClick={() => setProfileDropdownOpen(false)}
                            >
                              Your Profile
                            </NavLink>
                          </li>
                          <li>
                            <NavLink 
                              to="/settings" 
                              className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                              onClick={() => setProfileDropdownOpen(false)}
                            >
                              Account Settings
                            </NavLink>
                          </li>
                          <li>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FaSignOutAlt className="mr-2" />
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Mobile Menu Button */}
                <button 
                  className="md:hidden text-2xl"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-emerald-700"
              >
                <div className="container mx-auto px-4 py-3">
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for food, locations, organizations..."
                      className="w-full p-3 bg-white/90 text-gray-800 rounded-l-lg focus:outline-none"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="bg-emerald-800 text-white px-6 rounded-r-lg hover:bg-emerald-900"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-emerald-700"
              >
                <div className="container mx-auto px-4 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    {navItems.map((item) => (
                      <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({isActive}) => 
                          `p-4 rounded-lg flex flex-col items-center ${
                            isActive 
                              ? 'bg-white text-emerald-600 font-medium' 
                              : 'text-white hover:bg-emerald-800'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-xl mb-1">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-4 p-4 rounded-lg flex flex-col items-center text-white hover:bg-emerald-800"
                  >
                    <FaSignOutAlt className="text-xl mb-1" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}
    </>
  );
};

export default Navbar;