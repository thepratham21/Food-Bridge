import React, { useState, useEffect, useContext } from "react";
import {
  FaHandHoldingHeart,
  FaHandHoldingUsd,
  FaUsers,
  FaGift,
  FaMedal,
  FaCrown,
  FaChartLine,
  FaChevronRight,
  FaQuoteLeft,
} from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DonationModal from "./DonationModal";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [globalStats, setGlobalStats] = useState(null);
  const [userImpact, setUserImpact] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const newsCategories = [
    { id: "all", name: "All News" },
    { id: "politics", name: "Politics" },
    { id: "social", name: "Social Impact" },
    { id: "environment", name: "Environment" },
    { id: "health", name: "Health" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        const [statsRes, leaderboardRes, activitiesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/stats`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/activities`),
        ]);

        setGlobalStats(statsRes.data.stats);
        setLeaderboard(leaderboardRes.data.leaderboard);
        setActivities(activitiesRes.data.activities);

        if (isAuthenticated) {
          const impactRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/impact`,
            { withCredentials: true }
          );
          setUserImpact(impactRes.data.impact);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [isAuthenticated]);

  const handleDonationClick = (title) => {
    navigate("/user/donate");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-800/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center animate-subtle-zoom"></div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-emerald-100 text-sm font-medium"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Over 1.2M Meals Shared Worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
          >
            Share Food, <span className="text-emerald-400">Spread Joy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-emerald-50 max-w-3xl mb-10 leading-relaxed"
          >
            Join our mission to eliminate food waste and ensure no one goes to bed hungry. Every contribution makes a massive impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button
              onClick={() => navigate("/user/donate")}
              className="group bg-emerald-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
            >
              Start Donating <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Learn Our Impact
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Meals Shared", value: globalStats?.mealsShared || "1.2M+", icon: <FaHandHoldingHeart className="text-red-500" /> },
              { label: "Active Volunteers", value: globalStats?.volunteersCount || "25K+", icon: <FaUsers className="text-blue-500" /> },
              { label: "NGO Partners", value: globalStats?.ngosCount || "120+", icon: <FaHandHoldingUsd className="text-green-500" /> },
              { label: "Funds Raised", value: `₹${globalStats?.donationAmount?.toLocaleString() || "50L+"}`, icon: <FaGift className="text-yellow-500" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                  {loading ? <div className="h-10 w-24 bg-gray-100 animate-pulse mx-auto rounded-lg"></div> : stat.value}
                </div>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Ticker */}
      <div className="bg-emerald-900 py-4 overflow-hidden border-y border-emerald-800">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {activities?.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 text-emerald-50 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="font-bold">{activity.user}</span>
              <span className="text-emerald-300">{activity.description}</span>
              <span className="text-xs text-emerald-500">• {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {activities?.map((activity, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3 text-emerald-50 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="font-bold">{activity.user}</span>
              <span className="text-emerald-300">{activity.description}</span>
              <span className="text-xs text-emerald-500">• {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Impact Section - Only if authenticated */}
      <AnimatePresence>
        {isAuthenticated && userImpact && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20"
          >
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="text-center lg:text-left flex-1">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Hello, {user?.firstName}! 👋</h2>
                    <p className="text-emerald-100 text-xl mb-8 leading-relaxed max-w-xl">
                      You're a vital part of the FoodBridge family. Your consistent support is turning surplus into survival for many.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <button
                        onClick={() => navigate("/user/history")}
                        className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition shadow-xl"
                      >
                        My Contribution History
                      </button>
                      <button
                        onClick={() => navigate("/profile")}
                        className="bg-emerald-500/30 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-500/50 transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] text-center border border-white/20 shadow-inner">
                      <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaHandHoldingHeart className="text-3xl text-emerald-300" />
                      </div>
                      <p className="text-emerald-100 font-medium mb-1">Meals Provided</p>
                      <p className="text-5xl font-black">{userImpact.mealsProvided}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] text-center border border-white/20 shadow-inner">
                      <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaHandHoldingUsd className="text-3xl text-emerald-300" />
                      </div>
                      <p className="text-emerald-100 font-medium mb-1">Donated Amount</p>
                      <p className="text-5xl font-black">₹{userImpact.donatedAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Ways to Contribute */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Ways to Make an Impact</h2>
            <p className="text-gray-500 text-xl max-w-3xl mx-auto">
              Choose the path that fits you best. Every action, no matter how small, fuels our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHandHoldingHeart className="text-5xl text-red-500" />,
                title: "Food Donation",
                desc: "Share surplus cooked or raw food with verified local NGOs.",
                color: "bg-red-50",
                hover: "hover:bg-red-100",
                btn: "Donate Food"
              },
              {
                icon: <FaHandHoldingUsd className="text-5xl text-emerald-500" />,
                title: "Money Donation",
                desc: "Fuel our logistics and operations with financial support.",
                color: "bg-emerald-50",
                hover: "hover:bg-emerald-100",
                btn: "Donate Money"
              },
              {
                icon: <FaUsers className="text-5xl text-blue-500" />,
                title: "Volunteer",
                desc: "Be the bridge! Help transport food from donors to beneficiaries.",
                color: "bg-blue-50",
                hover: "hover:bg-blue-100",
                btn: "Join Squad"
              },
              {
                icon: <FaGift className="text-5xl text-amber-500" />,
                title: "Corporate Partnership",
                desc: "Large scale impact through restaurant and hotel networks.",
                color: "bg-amber-50",
                hover: "hover:bg-amber-100",
                btn: "Partner with Us"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -15 }}
                onClick={() => handleDonationClick(item.title)}
                className={`${item.color} ${item.hover} rounded-[2.5rem] p-10 text-center shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-white/50`}
              >
                <div className="flex justify-center mb-8">{item.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{item.desc}</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-gray-900 hover:text-white transition-colors">
                  {item.btn}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm mb-4"
            >
              <FiAward /> TOP CONTRIBUTORS
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Our Community Heroes</h2>
            <p className="text-gray-500 text-xl">Honoring those who lead the way in kindness</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Top Donors */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white/50">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FaCrown className="text-yellow-500 text-3xl" />
                Impact Donors
              </h3>
              <div className="space-y-6">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-3xl"></div>
                  ))
                ) : (
                  leaderboard?.topDonors?.map((donor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 hover:bg-emerald-50 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                          idx === 0 ? "bg-yellow-400 text-white" :
                          idx === 1 ? "bg-gray-300 text-white" :
                          idx === 2 ? "bg-orange-400 text-white" : "bg-white text-gray-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg block">{donor.name}</span>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Monthly Hero</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-xl block">₹{donor.totalAmount}</span>
                        <span className="text-xs text-emerald-400 font-bold">Contributed</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Volunteers */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white/50">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FaMedal className="text-emerald-500 text-3xl" />
                Active Volunteers
              </h3>
              <div className="space-y-6">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-3xl"></div>
                  ))
                ) : (
                  leaderboard?.topVolunteers?.map((vol, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 hover:bg-emerald-50 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                          idx === 0 ? "bg-yellow-400 text-white" :
                          idx === 1 ? "bg-gray-300 text-white" :
                          idx === 2 ? "bg-orange-400 text-white" : "bg-white text-gray-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg block">{vol.name}</span>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">On-Ground Hero</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-xl block">{vol.completedTasks}</span>
                        <span className="text-xs text-emerald-400 font-bold uppercase">Meals Delivered</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Real Impact, <span className="text-emerald-500 text-shadow-glow">Real Stories</span></h2>
              <p className="text-gray-500 text-xl leading-relaxed">
                Witness the power of community action. Every meal shared is a ripple of hope through someone's life.
              </p>
            </div>
            <button className="bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all duration-300 group">
              View All Stories <FaChartLine className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                title: "Feeding 500 Families in Mumbai",
                desc: "Through local restaurant partnerships, we distributed over 1,500 kg of surplus food last month.",
                tag: "COMMUNITY",
                stats: "500+ Families",
                color: "emerald"
              },
              {
                image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                title: "Zero Waste Wedding Initiative",
                desc: "How one couple donated all surplus food from their wedding to a local orphanage.",
                tag: "SUCCESS STORY",
                stats: "250 Meals",
                color: "blue"
              },
              {
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                title: "Logistics for Rural Areas",
                desc: "Our new volunteer bike-squad is now reaching remote villages with essential supplies.",
                tag: "INNOVATION",
                stats: "12 Villages",
                color: "amber"
              }
            ].map((story, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl border border-white/30 font-black tracking-widest uppercase">
                      {story.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-black text-lg drop-shadow-md">{story.stats}</p>
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">{story.title}</h3>
                  <p className="text-gray-500 text-lg line-clamp-3 mb-6 leading-relaxed">{story.desc}</p>
                  <div className="w-12 h-1 bg-emerald-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Latest News</h2>
              <p className="text-gray-500 text-xl">Stay updated with food security initiatives</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {newsCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeCategory === category.id
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main News Item */}
            <div className="lg:col-span-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-xl h-full border border-white/50"
              >
                <div
                  className="h-80 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1615361200141-f45040f0be0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1672&q=80')",
                  }}
                ></div>
                <div className="p-10">
                  <div className="flex items-center mb-6 gap-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-4 py-2 rounded-full font-black uppercase tracking-widest">
                      Food Security
                    </span>
                    <span className="text-gray-400 font-bold text-sm">
                      Oct 12, 2023
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                    Global Initiative Aims to Reduce Food Waste by 50%
                  </h3>
                  <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    A new coalition of governments, businesses, and NGOs has
                    launched an ambitious plan to tackle food waste worldwide.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 text-emerald-600 font-black text-lg hover:gap-5 transition-all"
                  >
                    Read Full Story <FaChevronRight />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Smaller News Items */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  image:
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Community",
                  title:
                    "Local Volunteers Distribute 5,000 Meals This Season",
                  date: "Dec 24, 2023",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Nutrition",
                  title:
                    "Impact of Food Donations on Child Development",
                  date: "Nov 15, 2023",
                },
                {
                  image:
                    "https://images.unsplash.com/photo-1517244683847-7456b63c5969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                  category: "Technology",
                  title:
                    "New App Connects Restaurants with Food Banks",
                  date: "Oct 30, 2023",
                },
                {
                  image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                  category: "Policy",
                  title: "New Government Policy Incentivizes Food Donation",
                  date: "Sep 18, 2023"
                }
              ].map((news, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-white/50"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${news.image}')` }}
                  ></div>
                  <div className="p-8">
                    <div className="flex items-center mb-4 gap-3">
                      <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-wider">
                        {news.category}
                      </span>
                      <span className="text-gray-400 text-xs font-bold">
                        {news.date}
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 mb-4 leading-tight">
                      {news.title}
                    </h4>
                    <a
                      href="#"
                      className="text-emerald-600 text-sm font-black hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Voices of FoodBridge</h2>
            <p className="text-gray-500 text-xl max-w-3xl mx-auto">
              Real feedback from the incredible people making this movement possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                quote:
                  "Donating through FoodBridge has been incredibly rewarding. Knowing my surplus food helps families in need gives me peace of mind.",
                name: "Sarah Johnson",
                role: "Restaurant Owner",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              },
              {
                quote:
                  "As a volunteer, I've seen firsthand how this platform brings communities together. Every weekend I help distribute food to those who need it most.",
                name: "Michael Chen",
                role: "Volunteer",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              },
              {
                quote:
                  "During a difficult time, FoodBridge provided meals for my family. This initiative is a lifeline for so many in our community.",
                name: "Maria Rodriguez",
                role: "Beneficiary",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 p-12 rounded-[3rem] shadow-sm relative group hover:bg-emerald-600 transition-all duration-500"
              >
                <FaQuoteLeft className="text-emerald-200 text-5xl absolute top-8 left-8 group-hover:text-emerald-400 transition-colors" />
                <div className="relative z-10">
                  <div className="text-yellow-400 text-2xl mb-8">★★★★★</div>
                  <p className="text-gray-600 text-xl italic mb-10 leading-relaxed group-hover:text-white transition-colors">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-5">
                    <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                    <div>
                      <h4 className="font-black text-gray-900 group-hover:text-white transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-emerald-600 font-bold text-sm group-hover:text-emerald-200 transition-colors">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Be the Change <br className="hidden md:block" /> India Needs
          </h2>
          <p className="text-emerald-50 text-xl max-w-2xl mx-auto mb-12 font-medium opacity-90">
            Join 50,000+ citizens who are actively fighting hunger every single day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => navigate("/user/donate")}
              className="bg-white text-emerald-600 px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl"
            >
              Donate Now
            </button>
            <button className="bg-emerald-500/30 backdrop-blur-md border-2 border-white/30 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-emerald-500/50 transition-all">
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="bg-emerald-500 p-3 rounded-2xl mr-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <FaHandHoldingHeart className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">FoodBridge</h3>
              </div>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Connecting surplus food with those in need to build stronger, zero-hunger communities.
              </p>
              <div className="flex space-x-5">
                {['facebook', 'twitter', 'instagram'].map((social) => (
                  <a key={social} href="#" className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm">
                    <span className="sr-only">{social}</span>
                    {/* Placeholder for social icons */}
                    <div className="w-5 h-5 bg-current rounded-sm opacity-50"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 border-b border-gray-800 pb-4">Mission</h4>
              <ul className="space-y-4">
                {['About Us', 'How It Works', 'Success Stories', 'Our Partners', 'Careers'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 border-b border-gray-800 pb-4">Help</h4>
              <ul className="space-y-4">
                {['FAQ', 'Donation Guidelines', 'Food Safety', 'Annual Report', 'Privacy Policy'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8 border-b border-gray-800 pb-4">Contact</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-gray-400 font-medium">contact@foodbridge.org</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <span className="text-gray-400 font-medium">123 Community St, City, Country</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 font-bold">© {new Date().getFullYear()} FoodBridge. Built with ❤️ for India.</p>
            <div className="flex gap-8 text-sm font-black text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Legal</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
};

export default Home;
