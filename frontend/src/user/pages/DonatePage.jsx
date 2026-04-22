import React, { useState, useContext } from "react";
import { 
  FaHandHoldingHeart, 
  FaClock, 
  FaMapMarkerAlt, 
  FaInfoCircle, 
  FaCheck,
  FaExclamationTriangle,
  FaUtensils,
  FaCoins,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import DonationModal from "./DonationModal"; // We'll use this for money donation

const DonatePage = () => {
  const { user } = useContext(AuthContext);
  const [donationType, setDonationType] = useState(null); // 'food' or 'money'
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    description: "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    date: "",
    time: "afternoon",
    instructions: "",
    foodStyle: "Cooked Food",
    foodCategory: "Veg"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Mapping for time to hours
    const timeMap = { morning: '08:00', afternoon: '12:00', evening: '16:00' };
    
    // Ensure we have a valid date and time for the backend
    let foodtime = null;
    if (formData.date) {
      const timeStr = timeMap[formData.time] || '12:00';
      foodtime = new Date(`${formData.date}T${timeStr}`);
    } else {
      // Fallback to current time if no date provided, though step 2 requires it
      foodtime = new Date();
    }

    try {
      const orderData = {
        foodDetails: `${formData.foodType}: ${formData.description}`,
        quantity: parseInt(formData.quantity) || 1,
        address: formData.address,
        pincode: formData.pincode,
        foodtime: foodtime.toISOString(),
        foodType: formData.foodCategory || "Veg",
        foodStyle: formData.foodStyle || "Cooked Food"
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/order/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      setFormData({
        foodType: "", quantity: "", description: "", address: "", pincode: "",
        date: "", time: "afternoon", instructions: "", foodStyle: "Cooked Food", foodCategory: "Veg"
      });
      nextStep(); // Move to success step
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "An error occurred while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  if (!donationType) {
    return (
      <div className="min-h-screen bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-black text-gray-900 mb-6">Choose Your <span className="text-emerald-600">Impact.</span></h1>
            <p className="text-xl text-gray-500 font-medium">How would you like to help the community today?</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              whileHover={{ y: -10 }}
              onClick={() => setDonationType('food')}
              className="bg-emerald-50 rounded-[3rem] p-10 cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all group"
            >
              <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <FaUtensils className="text-3xl" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Donate Food</h3>
              <p className="text-gray-500 font-bold mb-8">Share surplus meals or grocery items with those in need nearby.</p>
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black">
                <span>Start Food Donation</span>
                <FaArrowRight />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              onClick={() => setIsMoneyModalOpen(true)}
              className="bg-blue-50 rounded-[3rem] p-10 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all group"
            >
              <div className="w-20 h-20 bg-white text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <FaCoins className="text-3xl" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Donate Money</h3>
              <p className="text-gray-500 font-bold mb-8">Contribute funds to help us scale our logistics and reach more people.</p>
              <div className="inline-flex items-center gap-2 text-blue-600 font-black">
                <span>Contribute Funds</span>
                <FaArrowRight />
              </div>
            </motion.div>
          </div>

          <DonationModal isOpen={isMoneyModalOpen} onClose={() => setIsMoneyModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setDonationType(null)}
          className="flex items-center gap-2 text-gray-500 font-bold mb-10 hover:text-emerald-600 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Selection</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-100 overflow-hidden border border-gray-100">
          <div className="p-12">
            {/* Header */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-4xl font-black text-gray-900">Food Donation</h2>
                  <p className="text-gray-500 font-bold">Step {step} of 3</p>
                </div>
                <div className="text-emerald-600 font-black text-2xl">{progressPercentage.toFixed(0)}%</div>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Type of Food</label>
                      <select
                        name="foodType"
                        value={formData.foodType}
                        onChange={handleChange}
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all appearance-none"
                      >
                        <option value="">Select food type</option>
                        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                        <option value="Grains & Bread">Grains & Bread</option>
                        <option value="Dairy Products">Dairy Products</option>
                        <option value="Cooked Meals">Cooked Meals</option>
                        <option value="Packaged Food">Packaged Food</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Quantity (servings)</label>
                      <select
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all appearance-none"
                      >
                        <option value="">Select quantity</option>
                        <option value="5">1–5 servings</option>
                        <option value="20">6–20 servings</option>
                        <option value="50">21–50 servings</option>
                        <option value="100">50+ servings</option>
                      </select>
                    </div>
                  </div>

                  {/* Veg / Non-veg toggle */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Diet Type</label>
                    <div className="flex gap-4">
                      {["Veg", "Non-veg"].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, foodCategory: type }))}
                          className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-all ${
                            formData.foodCategory === type
                              ? type === "Veg"
                                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-100"
                                : "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                              : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          {type === "Veg" ? "🌿 Vegetarian" : "🍗 Non-Vegetarian"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Raw / Cooked toggle */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Food Style</label>
                    <div className="flex gap-4">
                      {["Cooked Food", "Raw Food"].map(style => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, foodStyle: style }))}
                          className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-all ${
                            formData.foodStyle === style
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                              : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          {style === "Cooked Food" ? "🍲 Cooked Food" : "🥦 Raw / Uncooked"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="e.g. 5 boxes of fresh vegetable biryani, still hot..."
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all min-h-[130px] resize-none"
                    />
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={!formData.foodType || !formData.quantity}
                    className="w-full py-5 bg-emerald-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Next Step <FaArrowRight />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Pickup Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address..."
                      className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Pincode</label>
                      <input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit code"
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Preferred Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 bg-gray-100 text-gray-600 font-black text-xl rounded-2xl hover:bg-gray-200 transition-all active:scale-95">Back</button>
                    <button onClick={nextStep} disabled={!formData.address || !formData.pincode} className="flex-[2] py-5 bg-emerald-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95">Review Donation</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-emerald-50 p-8 rounded-[2rem] border-2 border-emerald-100">
                    <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-2">
                      <FaCheck className="text-emerald-500" /> Confirm Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-emerald-800">
                      <div>
                        <p className="text-xs font-black uppercase opacity-50 mb-1">Items</p>
                        <p className="font-bold text-lg">{formData.foodType} ({formData.quantity} servings)</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase opacity-50 mb-1">Location</p>
                        <p className="font-bold text-lg">{formData.address}, {formData.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100"
                    >
                      <FaExclamationTriangle />
                      <p className="text-sm font-bold">{submitError}</p>
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="w-full py-6 bg-emerald-600 text-white font-black text-2xl rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? "Submitting..." : "Schedule Pickup"}
                      <FaArrowRight className="text-lg" />
                    </button>
                    <button onClick={prevStep} className="w-full py-5 text-gray-400 font-bold hover:text-gray-600 transition-colors">Edit Details</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-8xl mb-6"
                  >
                    🎉
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black text-gray-900 mb-4"
                  >
                    You're a Hero!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed"
                  >
                    Your donation has been scheduled. An NGO will review it and a volunteer will be in touch for pickup. Check your email for confirmation.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <button
                      onClick={() => { setDonationType(null); setStep(1); }}
                      className="px-10 py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-100"
                    >
                      Donate Again
                    </button>
                    <button
                      onClick={() => window.location.href = '/user/history'}
                      className="px-10 py-5 bg-gray-100 text-gray-700 font-black text-lg rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                      View My History
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
