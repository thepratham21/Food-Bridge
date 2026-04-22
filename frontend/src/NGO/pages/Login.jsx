import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { email, password, role: "NGO" },
        { withCredentials: true, timeout: 8000 }
      );
      if (data?.user) {
        login(data.user);
        navigate("/ngo/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid email or password."
          : err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 flex-col justify-between p-16 relative overflow-hidden">
        {/* background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-700/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaHandHoldingHeart className="text-white text-lg" />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter">FoodBridge</span>
          </div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Welcome back,<br />
              <span className="text-emerald-400">Partner NGO.</span>
            </h2>
            <p className="text-emerald-200 text-lg leading-relaxed max-w-md">
              Manage incoming food requests, coordinate volunteers, and track the real impact your organisation is making in the community.
            </p>
          </motion.div>
        </div>

        {/* Impact stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: "500+", label: "NGOs Active" },
            { value: "1.2M", label: "Meals Served" },
            { value: "98%",  label: "Success Rate" },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaHandHoldingHeart className="text-white text-lg" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-gray-900">FoodBridge</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">NGO Sign In</h1>
            <p className="text-gray-500 font-medium">Access your organisation's dashboard.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
            >
              <span className="text-red-500 text-lg mt-0.5">⚠</span>
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="ngo@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-black text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs font-bold text-emerald-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium">
              Not registered yet?{" "}
              <button
                onClick={() => navigate("/ngo/signup")}
                className="text-emerald-600 font-black hover:underline"
              >
                Register your NGO
              </button>
            </p>
          </div>

          <p className="mt-12 text-center text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} FoodBridge · All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
