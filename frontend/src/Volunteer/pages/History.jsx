import React, { useEffect, useState, useMemo } from 'react';
import { 
  FiClock, FiUser, FiMapPin, FiPackage, 
  FiCheckCircle, FiArrowLeft, FiSearch, 
  FiFilter, FiRefreshCw, FiCalendar, FiTruck
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/volunteer/history`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch completed orders.');
      setCompletedOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return completedOrders
      .filter(order => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const donorName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
          const foodDetails = order.foodDetails?.toLowerCase() || '';
          const address = order.address?.toLowerCase() || '';
          return donorName.includes(searchLower) || foodDetails.includes(searchLower) || address.includes(searchLower);
        }
        return true;
      })
      .sort((a, b) => {
        return sortBy === "newest" 
          ? new Date(b.updatedAt) - new Date(a.updatedAt)
          : new Date(a.updatedAt) - new Date(b.updatedAt);
      });
  }, [completedOrders, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-36 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate("/volunteer/dashboard")}
              className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
            >
              <FiArrowLeft className="text-2xl" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Delivery History</h1>
              <p className="text-emerald-400 font-bold">Every completed mission is a life touched.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Missions Completed", value: completedOrders.length, icon: "🎯" },
              { label: "Meals Delivered", value: completedOrders.reduce((a, o) => a + (o.quantity || 0), 0), icon: "🍽️" },
              { label: "Impact Points", value: completedOrders.length * 10, icon: "⭐" },
              { label: "NGOs Served", value: [...new Set(completedOrders.map(o => o.ngoId?._id).filter(Boolean))].length, icon: "🏥" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 -mt-20">
        {/* Controls */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-10 flex flex-col md:flex-row gap-6 border border-gray-100">
          <div className="relative flex-1">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by donor or food details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <button 
              onClick={fetchCompletedOrders}
              className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl hover:bg-emerald-200 transition-all"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-white animate-pulse rounded-[3rem] shadow-sm"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-5xl">
              <FiClock />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">No History Yet</h3>
            <p className="text-xl text-gray-500 font-medium">Your completed missions will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group"
              >
                <div className="p-8 border-b border-gray-50 bg-emerald-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Mission Completed
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                      <FiCalendar />
                      <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{order.foodDetails}</h3>
                  <p className="text-emerald-600 font-bold text-lg">{order.quantity} Units Shared</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                      <FiMapPin />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pickup From</p>
                      <p className="font-bold text-gray-800 leading-tight">{order.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                      <FiUser />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Donor Details</p>
                      <p className="font-bold text-gray-800 leading-tight">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </p>
                    </div>
                  </div>

                  {order.ngoId && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform">
                        <FiTruck />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Delivered To</p>
                        <p className="font-bold text-gray-800 leading-tight">
                          {order.ngoId.firstName} {order.ngoId.lastName}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{order.ngoId.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
