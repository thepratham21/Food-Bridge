import React, { useState, useContext, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiHeart, FiBox, FiClock, FiSettings, FiLogOut, FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { is } from 'date-fns/locale';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    password: '••••••••'
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
        password: '••••••••'
      });
    }
  }, [user]);

  const donationHistory = [
    { id: 1, date: '2023-05-15', items: '5 kg Rice, 2 kg Lentils', status: 'Delivered', impact: 'Fed 15 people' },
    { id: 2, date: '2023-04-28', items: '10 kg Vegetables, Bread', status: 'Delivered', impact: 'Fed 12 families' },
    { id: 3, date: '2023-04-10', items: '3 kg Flour, Cooking Oil', status: 'Processing', impact: 'Estimated: Feed 8 people' },
  ];
  
  const stats = {
    donations: 12,
    peopleFed: 84,
    itemsShared: 38,
    communityPoints: 1560
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSave = () => {
    // In a real app, this would update the user data in the backend
    setEditMode(false);
    alert('Profile updated successfully!');
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
              FoodShare
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
                <p className="text-emerald-600 font-medium">FoodShare Community Member</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{stats.donations}</div>
                  <div className="text-gray-600 text-sm">Donations</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{stats.peopleFed}</div>
                  <div className="text-gray-600 text-sm">People Fed</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{stats.itemsShared}</div>
                  <div className="text-gray-600 text-sm">Items Shared</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-emerald-600 font-bold text-2xl">{stats.communityPoints}</div>
                  <div className="text-gray-600 text-sm">Points</div>
                </div>
              </div>
              
              <nav className="space-y-2">
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
                        <div className="text-2xl font-bold">{stats.peopleFed} people fed</div>
                        <div className="opacity-80">through your donations</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xl font-bold">{stats.donations}</div>
                        <div className="opacity-80 text-sm">Donations</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{stats.itemsShared}</div>
                        <div className="opacity-80 text-sm">Items Shared</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{stats.communityPoints}</div>
                        <div className="opacity-80 text-sm">Points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Donation History Tab */}
            {activeTab === 'donations' && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Donation History</h2>
                
                <div className="space-y-4">
                  {donationHistory.map((donation) => (
                    <div 
                      key={donation.id}
                      className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center"
                    >
                      <div className="bg-emerald-100 text-emerald-800 rounded-xl p-3 mr-4">
                        <FiBox className="text-2xl" />
                      </div>
                      
                      <div className="flex-1 mr-4">
                        <div className="font-semibold text-gray-800">{donation.items}</div>
                        <div className="text-sm text-gray-600 mt-1">{donation.impact}</div>
                      </div>
                      
                      <div className="flex flex-col md:items-end mt-3 md:mt-0">
                        <div className="text-sm text-gray-500">
                          <FiClock className="inline mr-1" />
                          {donation.date}
                        </div>
                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                          donation.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {donation.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Donations</h3>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center">
                      <FiClock className="text-2xl mr-3" />
                      <div>
                        <div className="text-xl font-bold">Scheduled for June 25, 2023</div>
                        <div className="opacity-90">Fresh produce from your garden</div>
                      </div>
                    </div>
                  </div>
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
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <FiLock className="text-emerald-600 mr-3" />
                      <div className="flex-1">••••••••</div>
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium">
                        Change Password
                      </button>
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