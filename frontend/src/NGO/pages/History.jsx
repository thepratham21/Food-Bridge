import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiClock, FiUser, FiMapPin, FiCheckCircle, FiXCircle,
  FiTruck, FiSearch, FiArrowLeft, FiRefreshCw, FiPhone,
  FiCalendar, FiPackage, FiActivity,
} from "react-icons/fi";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";

const STATUS_STYLE = {
  Completed: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500", icon: <FiCheckCircle /> },
  Accepted:  { pill: "bg-blue-50 text-blue-700 border-blue-200",          bar: "bg-blue-500",    icon: <FiTruck /> },
  Rejected:  { pill: "bg-red-50 text-red-700 border-red-200",             bar: "bg-red-500",     icon: <FiXCircle /> },
  Pending:   { pill: "bg-amber-50 text-amber-700 border-amber-200",       bar: "bg-amber-500",   icon: <FiClock /> },
};

const History = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/history`, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const filtered = useMemo(() => {
    return orders
      .filter(o => {
        if (filter !== "all" && o.status !== filter) return false;
        if (search) {
          const t = search.toLowerCase();
          const donor = `${o.userId?.firstName || ""} ${o.userId?.lastName || ""}`.toLowerCase();
          return donor.includes(t) || o.foodDetails?.toLowerCase().includes(t) || o.address?.toLowerCase().includes(t);
        }
        return true;
      })
      .sort((a, b) => sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt));
  }, [orders, filter, search, sort]);

  const completed = orders.filter(o => o.status === "Completed").length;
  const inProgress = orders.filter(o => o.status === "Accepted").length;
  const totalServings = orders.filter(o => o.status === "Completed").reduce((s, o) => s + (o.quantity || 0), 0);

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "Completed", label: "Completed" },
    { key: "Accepted", label: "In Progress" },
    { key: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #34d399 0%, transparent 50%), radial-gradient(circle at 10% 80%, #6ee7b7 0%, transparent 40%)" }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/ngo/dashboard")}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                <FiArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Order History</h1>
                <p className="text-emerald-400 font-bold mt-1">A record of every meal your NGO has handled.</p>
              </div>
            </div>
            <button onClick={fetchHistory}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-black text-sm backdrop-blur-sm">
              <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Handled", value: orders.length,  icon: "📋" },
              { label: "Completed",     value: completed,       icon: "✅" },
              { label: "In Progress",   value: inProgress,      icon: "🚗" },
              { label: "Meals Served",  value: totalServings,   icon: "🍽️" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 -mt-24 relative z-10">
        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search donor, food details, address..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-5 py-3.5 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                  filter === f.key
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-emerald-300"
                }`}>
                {f.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.key ? "bg-white/20" : "bg-gray-200"}`}>
                  {f.key === "all" ? orders.length : orders.filter(o => o.status === f.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-56 bg-white animate-pulse rounded-3xl shadow-sm" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your filters or search term.</p>
            <button onClick={() => { setFilter("all"); setSearch(""); }}
              className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((order, idx) => {
              const st = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
              return (
                <motion.div key={order._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
                  <div className={`h-1.5 w-full ${st.bar}`} />
                  <div className="p-7">
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${st.bar} flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform`}>
                          {st.icon}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-lg leading-tight">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </p>
                          {order.userId?.phone && (
                            <a href={`tel:${order.userId.phone}`}
                              className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline mt-0.5">
                              <FiPhone className="text-[10px]" /> {order.userId.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${st.pill}`}>
                        {st.icon} {order.status}
                      </span>
                    </div>

                    {/* Food details */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{order.foodDetails}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                              {order.quantity} servings
                            </span>
                            {order.foodType && (
                              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${order.foodType === "Veg" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                {order.foodType === "Veg" ? <FaLeaf /> : <FaDrumstickBite />} {order.foodType}
                              </span>
                            )}
                          </div>
                        </div>
                        <FiPackage className="text-gray-300 text-3xl shrink-0" />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-2.5 text-sm text-gray-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-emerald-500 shrink-0" />
                        <span>{new Date(order.createdAt).toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-red-500 shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </div>
                      {order.volunteerId && (
                        <div className="flex items-center gap-2">
                          <FiTruck className="text-blue-500 shrink-0" />
                          <span>
                            Volunteer: <span className="text-gray-900 font-black">{order.volunteerId.firstName} {order.volunteerId.lastName}</span>
                            {order.volunteerId.phone && <> · {order.volunteerId.phone}</>}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
