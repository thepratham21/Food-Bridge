import React, { useState, useContext, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiHeart, FiBox, FiClock, FiSettings, FiLogOut, FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, refreshUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userImpact, setUserImpact] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        pincode: user.pincode || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      fetchImpact();
      fetchHistory();
    }
  }, [user]);

  const fetchImpact = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/impact`, { withCredentials: true });
      setUserImpact(data.impact);
    } catch (error) {
      console.error("Error fetching impact:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const [donationsRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/donation/user-donations`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/orders`, { withCredentials: true })
      ]);
      setDonationHistory(donationsRes.data.donations || []);
      setOrderHistory(ordersRes.data.orders || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/update`,
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/password/update`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Password updated successfully!');
        setFormData({ ...formData, oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
  logout();
  navigate("/");
};

  // Redirect to login if user is not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-md">
              <div className="text-white text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              FoodBridge
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </header>
        
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-4xl font-bold">
                    {user.firstName?.charAt(0) || 'J'}{user.lastName?.charAt(0) || 'D'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                    <FiEdit className="text-emerald-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
                <p className="text-emerald-600 font-medium">FoodBridge Community Member</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{userImpact?.mealsProvided || 0}</div>
                  <div className="text-gray-600 text-sm">Meals Shared</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">₹{userImpact?.donatedAmount || 0}</div>
                  <div className="text-gray-600 text-sm">Donated</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{donationHistory.length}</div>
                  <div className="text-gray-600 text-sm">Total Transactions</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{(userImpact?.mealsProvided || 0) * 10}</div>
                  <div className="text-gray-600 text-sm">Community Points</div>
                </div>
              </div>
              
              <nav className="mt-6 space-y-2">
                <button 
                  className={`flex items-center w-full p-3 rounded-xl text-left ${
                    activeTab === 'profile' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-gray-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FiUser className="mr-3" />
                  Profile
                </button>
                <button 
                  className={`flex items-center w-full p-3 rounded-xl text-left ${
                    activeTab === 'donations' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-gray-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setActiveTab('donations')}
                >
                  <FiBox className="mr-3" />
                  Donation History
                </button>
                <button 
                  className={`flex items-center w-full p-3 rounded-xl text-left ${
                    activeTab === 'settings' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-gray-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <FiSettings className="mr-3" />
                  Account Settings
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center bg-emerald-500 text-white py-2 px-4 rounded-xl"
                    >
                      <FiEdit className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div>
                      <button 
                        onClick={() => setEditMode(false)}
                        className="mr-3 py-2 px-4 border border-gray-300 rounded-xl text-gray-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        className="py-2 px-4 bg-emerald-500 text-white rounded-xl"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiUser className="mr-2 text-emerald-600" />
                      First Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.firstName}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiUser className="mr-2 text-emerald-600" />
                      Last Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.lastName}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiMail className="mr-2 text-emerald-600" />
                      Email Address
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.email}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiPhone className="mr-2 text-emerald-600" />
                      Phone Number
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.phone}</div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiMapPin className="mr-2 text-emerald-600" />
                      Address
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.address}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiMapPin className="mr-2 text-emerald-600" />
                      Pincode
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">{formData.pincode}</div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Impact</h3>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center mb-4">
                      <FiHeart className="text-2xl mr-3" />
                      <div>
                        <div className="text-2xl font-bold">{(userImpact?.mealsProvided || 0) + (userImpact?.donatedAmount || 0) / 10} lives touched</div>
                        <div className="opacity-80">through your donations</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xl font-bold">{userImpact?.mealsProvided || 0}</div>
                        <div className="opacity-80 text-sm">Meals Shared</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">₹{userImpact?.donatedAmount || 0}</div>
                        <div className="opacity-80 text-sm">Donated</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{(userImpact?.mealsProvided || 0) * 10}</div>
                        <div className="opacity-80 text-sm">Points Earned</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'donations' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Donation History</h2>
                
                <div className="space-y-4">
                  {donationHistory.length === 0 && orderHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No donation history found. Start your journey today!
                    </div>
                  ) : (
                    <>
                      {/* Money Donations */}
                      {donationHistory.map((donation) => (
                        <div 
                          key={donation._id}
                          className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center"
                        >
                          <div className="bg-emerald-100 text-emerald-800 rounded-xl p-3 mr-4">
                            <FiCreditCard className="text-2xl" />
                          </div>
                          
                          <div className="flex-1 mr-4">
                            <div className="font-semibold text-gray-800">Financial Donation</div>
                            <div className="text-sm text-gray-600 mt-1">₹{donation.amount} contributed to FoodBridge</div>
                          </div>
                          
                          <div className="flex flex-col md:items-end mt-3 md:mt-0">
                            <div className="text-sm text-gray-500">
                              <FiClock className="inline mr-1" />
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </div>
                            <div className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                              {donation.status}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Food Donations (Orders) */}
                      {orderHistory.map((order) => (
                        <div 
                          key={order._id}
                          className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center mt-4"
                        >
                          <div className="bg-blue-100 text-blue-800 rounded-xl p-3 mr-4">
                            <FiBox className="text-2xl" />
                          </div>
                          
                          <div className="flex-1 mr-4">
                            <div className="font-semibold text-gray-800">{order.foodDetails}</div>
                            <div className="text-sm text-gray-600 mt-1">{order.quantity} units • {order.foodType}</div>
                          </div>
                          
                          <div className="flex flex-col md:items-end mt-3 md:mt-0">
                            <div className="text-sm text-gray-500">
                              <FiClock className="inline mr-1" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'Completed' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Password</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Notification Preferences</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>Donation reminders</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>Community updates</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>Special offers</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Management</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                        Download my data
                      </button>
                      <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                        Request account deletion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;