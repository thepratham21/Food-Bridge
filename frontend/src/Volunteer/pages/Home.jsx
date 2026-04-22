import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiClock, FiUser, FiMapPin, FiLogOut,
  FiCheckCircle, FiTruck, FiNavigation,
  FiBox, FiInfo, FiActivity, FiStar, FiAward,
  FiArrowRight, FiCalendar, FiExternalLink,
} from "react-icons/fi";
import { FaHandHoldingHeart, FaCrown, FaMedal } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userImpact, setUserImpact] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [recentMissions, setRecentMissions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ordersRes, impactRes, leaderboardRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/volunteer/orders`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/impact`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/volunteer/history`, { withCredentials: true })
      ]);
      setAcceptedOrders(ordersRes.data.orders || []);
      setUserImpact(impactRes.data.impact);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setRecentMissions((historyRes.data.orders || []).slice(0, 3));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setCompleting(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/order/complete`,
        { orderId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Mission Accomplished! Order marked as completed.");
        setSelectedOrder(null);
        fetchAllData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete order");
    } finally {
      setCompleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-emerald-900 text-white flex flex-col shrink-0">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiTruck className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Volunteer</h1>
          </div>
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest px-1">Delivery Squad</p>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-emerald-800 rounded-2xl text-white font-bold transition-all shadow-lg">
            <FiNavigation /> Active Missions
          </button>
          <button onClick={() => navigate("/volunteer/history")} className="w-full flex items-center gap-3 px-6 py-4 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-2xl font-bold transition-all">
            <FiClock /> Past Deliveries
          </button>
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-6 py-4 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-2xl font-bold transition-all">
            <FiUser /> Profile
          </button>
        </nav>

        <div className="p-8 border-t border-emerald-800">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-xl shadow-lg">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-black truncate text-sm">{user?.firstName}</p>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">On-Ground Hero</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your Mission Center</h2>
            <p className="text-gray-500 font-bold mt-1">Ready to make a difference today?</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            {[
              { label: "Active", value: acceptedOrders.length, icon: <FiTruck />, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Delivered", value: userImpact?.mealsProvided || 0, icon: <FiCheckCircle />, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Points", value: (userImpact?.mealsProvided || 0) * 10, icon: <FiStar />, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex items-center gap-4 flex-1 lg:flex-none min-w-[140px]">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Active Missions List */}
          <div className="xl:col-span-2 space-y-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map(i => <div key={i} className="h-80 bg-white animate-pulse rounded-[3rem] shadow-sm"></div>)}
              </div>
            ) : acceptedOrders.length === 0 ? (
              <div className="bg-white rounded-[4rem] p-20 text-center shadow-2xl shadow-gray-100 border border-gray-50">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500 text-5xl shadow-inner">
                  <FiCheckCircle />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">No Active Missions</h3>
                <p className="text-gray-500 font-bold max-w-sm mx-auto text-lg leading-relaxed">You've completed all your tasks! Take a rest or wait for new NGO assignments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {acceptedOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100 flex flex-col hover:shadow-emerald-100 transition-all duration-500 group"
                  >
                    <div className="p-10 border-b border-gray-50 bg-emerald-50/20 group-hover:bg-emerald-50/40 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          In Transit
                        </span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          #{order._id.slice(-6)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{order.foodDetails}</h3>
                      <p className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <FiBox /> {order.quantity} Units • {order.foodType}
                      </p>
                    </div>

                    <div className="p-10 space-y-8 flex-1">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <FiMapPin className="text-2xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pickup Address</p>
                          <p className="font-bold text-gray-800 text-lg leading-tight">{order.address}</p>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
                          >
                            <FiNavigation className="text-sm" /> Get Directions <FiExternalLink className="text-[10px]" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <FiUser className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Contact Donor</p>
                          <p className="font-bold text-gray-800 text-lg leading-tight">{order.userId?.firstName || "Anonymous"} {order.userId?.lastName || ""}</p>
                          {order.userId?.phone && (
                            <a href={`tel:${order.userId.phone}`} className="text-emerald-600 font-bold text-sm mt-1 flex items-center gap-1 hover:underline">
                              📞 {order.userId.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      {order.foodtime && (
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                            <FiCalendar className="text-2xl" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pickup Time</p>
                            <p className="font-bold text-gray-800 text-lg leading-tight">
                              {new Date(order.foodtime).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-10 pt-0">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        Complete Delivery <FiCheckCircle className="text-xl" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recent Missions Summary */}
            {recentMissions.length > 0 && (
              <section className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <FiClock className="text-emerald-500" /> Recent Missions
                  </h3>
                  <button onClick={() => navigate("/volunteer/history")} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">Full History</button>
                </div>
                <div className="p-10 space-y-6">
                  {recentMissions.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-emerald-50 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:rotate-12 transition-transform">
                          <FiCheckCircle className="text-2xl" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{m.foodDetails}</p>
                          <p className="text-xs text-gray-400 font-bold mt-1">Shared with {m.ngoId?.firstName || "NGO Partner"}</p>
                        </div>
                      </div>
                      <p className="font-black text-emerald-600 text-sm">{new Date(m.updatedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar - Leaderboard & Activity */}
          <div className="space-y-10">
            {/* Squad Leaderboard */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FiAward className="text-amber-500 text-2xl" /> Squad Leaders
              </h3>
              <div className="space-y-6">
                {leaderboard?.topVolunteers?.slice(0, 5).map((vol, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-all group-hover:scale-110 ${
                        idx === 0 ? "bg-amber-400 text-white" : "bg-gray-50 text-gray-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-tight">{vol.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ground Hero</p>
                      </div>
                    </div>
                    <p className="font-black text-emerald-600 text-sm">{vol.completedTasks} 🎯</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Tip Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <FiInfo className="text-4xl text-emerald-200 mb-6" />
                <h4 className="text-2xl font-black mb-2">Pro Tip!</h4>
                <p className="text-emerald-100 text-sm font-bold leading-relaxed mb-8">
                  Always verify the <span className="text-white">Expiry Date</span> before picking up packaged items. Safety is our #1 priority!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  <FiActivity className="text-emerald-300" /> Community Standard
                </div>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-200 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-4">"The best way to find yourself is to lose yourself in the service of others."</h4>
                <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">— Mahatma Gandhi</p>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Completion Confirmation Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white w-full max-w-lg rounded-[4rem] shadow-2xl overflow-hidden p-12 md:p-16 text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 text-5xl shadow-inner">
                <FiCheckCircle />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Confirm Mission Success</h3>
              <p className="text-gray-500 font-bold mb-12 text-lg leading-relaxed">
                Have you successfully delivered <span className="text-emerald-600 font-black">"{selectedOrder.foodDetails}"</span> to the NGO partner?
              </p>

              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-5 bg-gray-100 text-gray-500 font-black text-xl rounded-[2rem] hover:bg-gray-200 transition-all active:scale-95"
                >
                  Wait
                </button>
                <button
                  onClick={() => handleCompleteOrder(selectedOrder._id)}
                  disabled={completing}
                  className="flex-[2] bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {completing ? "Updating..." : "Yes, Delivered!"} <FiArrowRight />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
