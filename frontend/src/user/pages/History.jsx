import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock, 
  FaMapMarkerAlt, 
  FaInfoCircle, 
  FaUtensils, 
  FaUser,
  FaFilter,
  FaSearch,
  FaSort,
  FaTimes,
  FaHandHoldingUsd
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {

  const { user } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [view, setView] = useState("food"); // "food" or "money"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch food orders
        const orderResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/orders`, {
          withCredentials: true,
        });
        setHistory(orderResponse.data.orders || []);

        // Fetch donations
        const donationResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/donation/user-donations`, {
          withCredentials: true,
        });
        setDonations(donationResponse.data.donations || []);

        setLoading(false);
      } catch (err) {
        setError("Failed to load history. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, user?.id]);

  const filteredHistory = history.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = order.foodDetails.toLowerCase().includes(term) ||
      (order.ngoId && `${order.ngoId.firstName} ${order.ngoId.lastName}`.toLowerCase().includes(term)) ||
      order.address.toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const filteredDonations = donations.filter(donation => {
    const term = searchTerm.toLowerCase();
    return donation.donorName.toLowerCase().includes(term) ||
      donation.orderId.toLowerCase().includes(term);
  }).sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Accepted: "bg-blue-100 text-blue-800",
      Delivered: "bg-purple-100 text-purple-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  const statusCounts = {
    All: history.length,
    Completed: history.filter(o => o.status === "Completed").length,
    Pending: history.filter(o => o.status === "Pending").length,
    Accepted: history.filter(o => o.status === "Accepted").length,
    Delivered: history.filter(o => o.status === "Delivered").length,
    Cancelled: history.filter(o => o.status === "Cancelled").length,
  };

  const toggleSidebar = () => {
    setSelectedOrder(null);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Your Contributions</h1>
            <p className="text-gray-600 max-w-2xl">
              Track and manage all your food and monetary donations in one place
            </p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
            <button
              onClick={() => setView("food")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                view === "food" 
                  ? "bg-emerald-500 text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaUtensils />
              Food
            </button>
            <button
              onClick={() => setView("money")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                view === "money" 
                  ? "bg-emerald-500 text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaHandHoldingUsd />
              Money
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {(view === "food" ? Object.entries(statusCounts) : [
            ["Total", donations.length],
            ["Total Amount", `₹${donations.reduce((acc, d) => acc + d.amount, 0)}`],
            ["Avg. Donation", donations.length > 0 ? `₹${Math.round(donations.reduce((acc, d) => acc + d.amount, 0) / donations.length)}` : "₹0"],
            ["This Month", donations.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length],
          ]).map(([status, count]) => (
            <motion.div 
              key={status}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer ${
                statusFilter === status && view === "food" ? "ring-2 ring-emerald-500" : ""
              }`}
              onClick={() => view === "food" && setStatusFilter(status)}
            >
              <p className="text-sm text-gray-600 truncate">{status}</p>
              <p className={`text-2xl font-bold ${
                status === "Completed" || status === "Total Amount" ? "text-green-600" :
                status === "Pending" ? "text-yellow-600" :
                status === "Cancelled" ? "text-red-600" : "text-gray-800"
              }`}>
                {count}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${view === "food" ? "orders" : "donations"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              {view === "food" && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSort className="text-gray-400" />
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (view === "food" ? filteredHistory.length === 0 : filteredDonations.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <FaInfoCircle className="text-gray-400 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No {view === "food" ? "orders" : "donations"} found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {view === "food" 
                ? (history.length === 0 ? "You don't have any orders in your history yet." : "No orders match your current filters.")
                : (donations.length === 0 ? "You haven't made any monetary donations yet." : "No donations match your current search.")}
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && !error && view === "food" && filteredHistory.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => handleOrderSelect(order)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {order.foodDetails.substring(0, 40)}
                        {order.foodDetails.length > 40 && "..."}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                        <FaUser className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Receiver</p>
                        <p className="font-medium text-sm">
                          {order.ngoId 
                            ? `${order.ngoId.firstName} ${order.ngoId.lastName}` 
                            : 'Not assigned'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <FaUtensils className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium text-sm">{order.quantity} servings</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-amber-100 p-2 rounded-lg mr-3">
                        <FaClock className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order Time</p>
                        <p className="font-medium text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <FaMapMarkerAlt className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-sm truncate">
                          {order.address.substring(0, 20)}
                          {order.address.length > 20 && "..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full py-2 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Money Donations List */}
        {!loading && !error && view === "money" && filteredDonations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
                      <FaHandHoldingUsd size={28} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-2">
                        Success
                      </span>
                      <p className="text-[10px] text-gray-400 font-mono">#{donation.orderId.substring(0, 12)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">Donation Amount</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      ₹{donation.amount}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date & Time</span>
                      <span className="font-semibold text-gray-700">{formatDate(donation.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment ID</span>
                      <span className="font-mono text-gray-600">{donation.paymentId?.substring(0, 12)}...</span>
                    </div>
                  </div>
                </div>
                
                <button className="mt-8 w-full py-3 bg-gray-50 text-emerald-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition font-bold text-sm">
                  Download Receipt
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Sidebar */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              onClick={toggleSidebar}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 m-auto z-50 max-w-3xl w-full h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button 
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1">
                <div className="p-6">
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6 flex items-start">
                    <FaInfoCircle className="text-emerald-600 text-xl mr-3 mt-0.5" />
                    <p className="text-emerald-700">
                      This order was {selectedOrder.status.toLowerCase()} on {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{selectedOrder._id}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{selectedOrder.quantity} servings</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaUtensils className="mr-2 text-emerald-600" />
                        Food Details
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{selectedOrder.foodDetails}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-emerald-600" />
                        Pickup Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium mb-1">Address</p>
                        <p className="mb-3">{selectedOrder.address}</p>
                        
                        <p className="font-medium mb-1">Pincode</p>
                        <p>{selectedOrder.pincode}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaUser className="mr-2 text-emerald-600" />
                        Receiver Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedOrder.ngoId ? (
                          <>
                            <p className="font-medium">{selectedOrder.ngoId.firstName} {selectedOrder.ngoId.lastName}</p>
                            <p className="text-gray-600 mb-2">{selectedOrder.ngoId.ngoDetails?.name}</p>
                            <p className="text-sm mb-1">{selectedOrder.ngoId.email}</p>
                            <p className="text-sm">{selectedOrder.ngoId.phone}</p>
                            <p className="mt-3 text-sm font-medium">Address:</p>
                            <p className="text-sm">{selectedOrder.ngoId.address}</p>
                          </>
                        ) : (
                          <p>No receiver assigned yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FaInfoCircle className="mr-2 text-emerald-600" />
                        Additional Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium mb-1">Food Type</p>
                        <p className="mb-3">{selectedOrder.foodType}</p>
                        
                        <p className="font-medium mb-1">Food Style</p>
                        <p>{selectedOrder.foodStyle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button 
                  onClick={toggleSidebar}
                  className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition shadow-md hover:shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;