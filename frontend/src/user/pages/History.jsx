import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUtensils, FaHandHoldingUsd, FaArrowLeft, FaLeaf,
  FaDrumstickBite, FaTimesCircle, FaFileDownload, FaSearch,
} from "react-icons/fa";
import {
  FiCalendar, FiMapPin, FiClock, FiCheckCircle,
  FiXCircle, FiTruck, FiAlertCircle, FiCreditCard,
} from "react-icons/fi";

const STATUS = {
  Completed: { color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle /> },
  Accepted:  { color: "bg-blue-500",    light: "bg-blue-50 text-blue-700 border-blue-200",       icon: <FiTruck /> },
  Pending:   { color: "bg-amber-500",   light: "bg-amber-50 text-amber-700 border-amber-200",     icon: <FiClock /> },
  Rejected:  { color: "bg-red-500",     light: "bg-red-50 text-red-700 border-red-200",           icon: <FiXCircle /> },
};

const STALE_MS = 6 * 60 * 60 * 1000;

const History = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [view, setView] = useState("food");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, donationRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/orders`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/donation/user-donations`, { withCredentials: true }),
        ]);
        setHistory(orderRes.data.orders || []);
        setDonations(donationRes.data.donations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this donation request?")) return;
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/order/cancel`, { orderId }, { withCredentials: true });
      toast.success("Request cancelled.");
      setHistory(prev => prev.map(o => o._id === orderId ? { ...o, status: "Rejected" } : o));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel.");
    }
  };

  const byDate = (a, b) => sort === "newest"
    ? new Date(b.createdAt) - new Date(a.createdAt)
    : new Date(a.createdAt) - new Date(b.createdAt);

  const filteredFood = history.filter(o => {
    const t = search.toLowerCase();
    return (o.foodDetails?.toLowerCase().includes(t) || o.address?.toLowerCase().includes(t))
      && (statusFilter === "All" || o.status === statusFilter);
  }).sort(byDate);

  const filteredMoney = donations.filter(d =>
    d.donorName?.toLowerCase().includes(search.toLowerCase())
  ).sort(byDate);

  const items = view === "food" ? filteredFood : filteredMoney;

  // stats
  const totalMoney = donations.reduce((s, d) => s + d.amount, 0);
  const completedFood = history.filter(o => o.status === "Completed").length;
  const pendingFood = history.filter(o => o.status === "Pending").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #34d399 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6ee7b7 0%, transparent 40%)" }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/user/dashboard")}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm">
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Impact Journey</h1>
                <p className="text-emerald-400 font-bold mt-1">Every contribution, every meal, every life.</p>
              </div>
            </div>
            <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
              <button onClick={() => setView("food")}
                className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${view === "food" ? "bg-white text-emerald-900 shadow-xl" : "text-emerald-100 hover:bg-white/10"}`}>
                <FaUtensils /> Food
              </button>
              <button onClick={() => setView("money")}
                className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${view === "money" ? "bg-white text-emerald-900 shadow-xl" : "text-emerald-100 hover:bg-white/10"}`}>
                <FaHandHoldingUsd /> Money
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 -mt-24 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(view === "food" ? [
            { label: "Total Requests", value: history.length,       icon: "📦", grad: "from-blue-500 to-blue-600" },
            { label: "Completed",      value: completedFood,        icon: "✅", grad: "from-emerald-500 to-teal-600" },
            { label: "Pending",        value: pendingFood,          icon: "⏳", grad: "from-amber-500 to-orange-500" },
            { label: "Meals Shared",   value: completedFood * 5,    icon: "🍽️", grad: "from-purple-500 to-indigo-600" },
          ] : [
            { label: "Transactions",   value: donations.length,     icon: "💳", grad: "from-blue-500 to-blue-600" },
            { label: "Total Donated",  value: `₹${totalMoney.toLocaleString("en-IN")}`, icon: "💰", grad: "from-emerald-500 to-teal-600" },
            { label: "Avg Donation",   value: donations.length ? `₹${Math.round(totalMoney / donations.length)}` : "—", icon: "📊", grad: "from-amber-500 to-orange-500" },
            { label: "Lives Impacted", value: Math.floor(totalMoney / 50), icon: "❤️", grad: "from-purple-500 to-indigo-600" },
          ]).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex items-center gap-4 group hover:shadow-2xl transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">{s.label}</p>
                <p className="text-2xl font-black text-gray-900 leading-tight">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex flex-col md:flex-row gap-4 border border-gray-100">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={`Search ${view === "food" ? "food or address" : "donor name"}...`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm" />
          </div>
          {view === "food" && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-5 py-3.5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="px-5 py-3.5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* List */}
        <div className={loading || items.length === 0 ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-5"}>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 col-span-2">
              {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white animate-pulse rounded-3xl shadow-sm" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-6">{view === "food" ? "🍽️" : "💳"}</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Records Found</h3>
              <p className="text-gray-500 font-medium">Your {view === "food" ? "donations" : "contributions"} will appear here.</p>
            </div>
          ) : view === "food" ? (
            filteredFood.map((order, idx) => {
              const st = STATUS[order.status] || STATUS.Pending;
              const isStale = order.status === "Pending" && (Date.now() - new Date(order.createdAt)) > STALE_MS;
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
                  {/* Top color bar */}
                  <div className={`h-1.5 w-full ${st.color}`} />
                  <div className="p-7 flex flex-col md:flex-row gap-6 items-start">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${st.color} flex items-center justify-center text-white text-2xl shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                      <FaUtensils />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-xl font-black text-gray-900">{order.foodDetails}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${st.light}`}>
                          {st.icon} {order.status}
                        </span>
                        {order.foodType && (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black ${order.foodType === "Veg" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {order.foodType === "Veg" ? <FaLeaf /> : <FaDrumstickBite />} {order.foodType}
                          </span>
                        )}
                        {isStale && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-orange-50 text-orange-600 border border-orange-200 animate-pulse">
                            <FiAlertCircle /> Awaiting &gt;6h
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-500 font-semibold">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-emerald-500 shrink-0" />
                          <span>{new Date(order.createdAt).toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric" })}</span>
                        </div>
                        {order.foodtime && (
                          <div className="flex items-center gap-2">
                            <FiClock className="text-blue-500 shrink-0" />
                            <span>Pickup: {new Date(order.foodtime).toLocaleString(undefined, { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-red-500 shrink-0" />
                          <span className="truncate">{order.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 shrink-0 self-center md:self-start mt-2 md:mt-0">
                      {order.status === "Pending" && (
                        <button onClick={() => handleCancel(order._id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-black text-sm border border-red-100">
                          <FaTimesCircle /> Cancel
                        </button>
                      )}
                      {order.status === "Completed" && (
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all font-black text-sm border border-emerald-100">
                          <FaFileDownload /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            filteredMoney.map((d, idx) => (
              <motion.div key={d._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="p-7 flex flex-col md:flex-row gap-6 items-center">
                  {/* Amount badge */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl px-6 py-5 text-white text-center shrink-0 shadow-xl shadow-emerald-100 group-hover:scale-105 transition-transform min-w-[120px]">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Donated</p>
                    <p className="text-3xl font-black">₹{d.amount.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl font-black text-gray-900">{d.donorName}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <FiCheckCircle /> Verified
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-emerald-500 shrink-0" />
                        <span>{new Date(d.createdAt).toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric" })}</span>
                      </div>
                      {d.paymentId && (
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-blue-500 shrink-0" />
                          <span className="font-mono text-xs truncate">{d.paymentId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all font-black text-sm border border-emerald-100 shrink-0">
                    <FaFileDownload /> Receipt
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
