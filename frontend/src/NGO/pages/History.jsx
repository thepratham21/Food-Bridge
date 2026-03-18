import React, { useEffect, useState, useMemo } from 'react';
import { 
  FiClock, FiUser, FiMapPin, FiPackage, 
  FiCheckCircle, FiXCircle, FiPhone, 
  FiSearch, FiArrowLeft, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/history`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch order history.");

        setOrderHistory(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orderHistory
      .filter(order => {
        // Status filter
        if (filter !== "all" && order.status !== filter) return false;
        
        // Search term filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const donorName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
          const foodDetails = order.foodDetails?.toLowerCase() || '';
          const ngoName = order.ngoId ? `${order.ngoId.firstName || ''} ${order.ngoId.lastName || ''}`.toLowerCase() : '';
          const address = order.address?.toLowerCase() || '';
          const notes = order.notes?.toLowerCase() || '';
          
          if (!donorName.includes(searchLower) && 
              !foodDetails.includes(searchLower) && 
              !ngoName.includes(searchLower) &&
              !address.includes(searchLower) &&
              !notes.includes(searchLower)) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
  }, [orderHistory, filter, searchTerm, sortBy]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Refresh data
  const refreshData = () => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/history`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch order history.");

        setOrderHistory(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 rounded-full hover:bg-white/20 transition"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FiClock className="mr-2" />
                  Order History
                </h1>
                <p className="text-emerald-100 mt-1">Track all your past food donation activities</p>
              </div>
            </div>
            <button 
              onClick={refreshData}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              <FiRefreshCw className={`text-xl ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="container mx-auto py-6 px-4">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by donor, food, receiver or address..."
                  className="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <FiFilter />
                Filters
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h3>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setFilter("all")}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                            filter === "all" 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All Orders
                        </button>
                        <button 
                          onClick={() => setFilter("completed")}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition ${
                            filter === "completed" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <FiCheckCircle className="mr-1" />
                          Completed
                        </button>
                        <button 
                          onClick={() => setFilter("cancelled")}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition ${
                            filter === "cancelled" 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <FiXCircle className="mr-1" />
                          Cancelled
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSortBy("newest")}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            sortBy === "newest" 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Newest First
                        </button>
                        <button 
                          onClick={() => setSortBy("oldest")}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            sortBy === "oldest" 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Oldest First
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orderHistory.length}</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <FiPackage className="text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orderHistory.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FiCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orderHistory.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <FiXCircle className="text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Showing</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredOrders.length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FiFilter className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
            <p className="text-gray-600">Loading your donation history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"
          >
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={refreshData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {filter === "all" && !searchTerm 
                ? "You haven't processed any orders yet." 
                : `No ${filter} orders match your search criteria.`}
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Order History Grid */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${
                  order.status === 'completed' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg flex items-center">
                        <FiUser className="mr-2 text-emerald-600" />
                        {order.userId?.firstName} {order.userId?.lastName}
                        {order.phone && (
                          <a 
                            href={`tel:${order.phone}`} 
                            className="ml-3 text-sm font-normal text-emerald-600 flex items-center"
                          >
                            <FiPhone className="mr-1" />
                            Contact
                          </a>
                        )}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiClock className="mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Food Details</label>
                      <p className="font-medium">{order.foodDetails}</p>
                      <div className="mt-2 flex items-center">
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                          {order.quantity} servings
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">Receiver</label>
                      <p className="font-medium">
                        {order.ngoId 
                          ? `${order.ngoId.firstName} ${order.ngoId.lastName}`
                          : "N/A"}
                      </p>
                      
                      {order.ngoId?.address && (
                        <div className="mt-2 flex items-start">
                          <FiMapPin className="text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{order.ngoId.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.address && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500 block mb-1">Pickup Address</label>
                      <div className="flex items-start">
                        <FiMapPin className="text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{order.address}</span>
                      </div>
                    </div>
                  )}

                  {order.notes && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-gray-500 block mb-1">Special Notes</label>
                      <p className="text-gray-600 italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>

                {order.completedAt && (
                  <div className="bg-gray-50 px-5 py-3 text-sm text-gray-500 flex items-center">
                    <FiCheckCircle className="mr-1.5 text-green-500" />
                    Completed on {formatDate(order.completedAt)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;