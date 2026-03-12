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
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {

  const { user } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/v1/order/orders", {
          withCredentials: true,
        });

        setHistory(response.data.orders || []);
        setFilteredHistory(response.data.orders || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...history];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.foodDetails.toLowerCase().includes(term) ||
        (order.ngoId && `${order.ngoId.firstName} ${order.ngoId.lastName}`.toLowerCase().includes(term)) ||
        order.address.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply sorting
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    setFilteredHistory(result);
  }, [searchTerm, statusFilter, sortOption, history]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
    setSidebarOpen(!sidebarOpen);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    toggleSidebar();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Donation History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track and manage all your food donation activities in one place
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <motion.div 
              key={status}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer ${
                statusFilter === status ? "ring-2 ring-emerald-500" : ""
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <p className="text-sm text-gray-600">{status}</p>
              <p className={`text-2xl font-bold ${
                status === "Completed" ? "text-green-600" :
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
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
        {!loading && !error && filteredHistory.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <FaInfoCircle className="text-gray-400 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {history.length === 0
                ? "You don't have any orders in your history yet."
                : "No orders match your current filters. Try adjusting your search or filters."}
            </p>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && !error && filteredHistory.length > 0 && (
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
                            <p className="text-gray-600 mb-2">{selectedOrder.ngoId.organizationName}</p>
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