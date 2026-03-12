import React, { useState, useContext } from "react";
import { 
  FaHandHoldingHeart, 
  FaClock, 
  FaMapMarkerAlt, 
  FaInfoCircle, 
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext"; // ✅ updated

const DonatePage = () => {

  const { user } = useContext(AuthContext); // ✅ updated

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    description: "",
    address: "",
    pincode: "",
    date: "",
    time: "",
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
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Create foodtime by combining date and time
    const timeMap = {
      morning: '08:00',
      afternoon: '12:00',
      evening: '16:00'
    };
    
    const foodtime = formData.date && formData.time 
      ? new Date(`${formData.date}T${timeMap[formData.time]}`) 
      : null;

    try {
      const orderData = {
        foodDetails: `${formData.foodType}: ${formData.description}`,
        quantity: parseInt(formData.quantity),
        address: formData.address,
        pincode: formData.pincode,
        foodtime,
        foodType: formData.foodCategory,
        foodStyle: formData.foodStyle,
        userId: user?.id,
        role: user?.role || "User"
      };

      const response = await fetch("http://localhost:4000/api/v1/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      // Reset form on success
      setFormData({
        foodType: "",
        quantity: "",
        description: "",
        address: "",
        pincode: "",
        date: "",
        time: "",
        instructions: "",
        foodStyle: "Cooked Food",
        foodCategory: "Veg"
      });
      
      nextStep(); // Go to success step
    } catch (error) {
      console.error("Donation error:", error);
      setSubmitError(error.message || "An error occurred while processing your donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  // Quantity mapping for display
  const quantityLabels = {
    "5": "1-5 servings",
    "20": "6-20 servings",
    "50": "21-50 servings",
    "100": "50+ servings"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center bg-emerald-100 p-4 rounded-full mb-4"
          >
            <FaHandHoldingHeart className="text-emerald-600 text-4xl" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          >
            Donate Food, Spread Hope
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Your donation can make a difference in someone's life. Fill out the form below to schedule a pickup.
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-emerald-600">Step {step} of 3</span>
            <span className="text-sm font-medium text-emerald-600">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-4">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-emerald-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>
                {step > 1 ? <FaCheck /> : "1"}
              </div>
              <span className="text-xs">Food Details</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? "text-emerald-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>
                {step > 2 ? <FaCheck /> : "2"}
              </div>
              <span className="text-xs">Pickup Info</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? "text-emerald-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="text-xs">Confirm</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Step 1: Food Details */}
          {step === 1 && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Food Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Food
                  </label>
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select food type</option>
                    <option value="fruits">Fruits & Vegetables</option>
                    <option value="grains">Grains & Bread</option>
                    <option value="dairy">Dairy Products</option>
                    <option value="cooked">Cooked Meals</option>
                    <option value="packaged">Packaged Food</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (approx.)
                  </label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select quantity</option>
                    <option value="5">1-5 servings</option>
                    <option value="20">6-20 servings</option>
                    <option value="50">21-50 servings</option>
                    <option value="100">50+ servings</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Category
                  </label>
                  <select
                    name="foodCategory"
                    value={formData.foodCategory}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-veg">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Style
                  </label>
                  <select
                    name="foodStyle"
                    value={formData.foodStyle}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="Cooked Food">Cooked Food</option>
                    <option value="Raw Food">Raw Ingredients</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the food items, packaging, and any special notes..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32"
                  required
                />
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <FaInfoCircle className="text-emerald-600 text-xl mr-3 mt-0.5" />
                  <p className="text-emerald-700">
                    Please ensure food is properly packaged and within safe consumption period. 
                    Perishable items should be refrigerated until pickup.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.foodType || !formData.quantity || !formData.description}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Pickup Details
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Pickup Details */}
          {step === 2 && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pickup Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-emerald-600" />
                  Pickup Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address for pickup..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-24"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaClock className="mr-2 text-emerald-600" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaClock className="mr-2 text-emerald-600" />
                    Preferred Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (8am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 4pm)</option>
                    <option value="evening">Evening (4pm - 8pm)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="Any specific instructions for pickup? (e.g., gate code, contact person, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.address || !formData.pincode || !formData.date || !formData.time}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Confirm
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Donation</h2>
              
              {submitError && (
                <div className="bg-red-50 p-4 rounded-lg mb-6 flex items-start">
                  <FaExclamationTriangle className="text-red-500 text-xl mr-3 mt-0.5" />
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">Food Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Food Type</p>
                    <p className="font-medium">{formData.foodType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Quantity</p>
                    <p className="font-medium">{quantityLabels[formData.quantity] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Food Category</p>
                    <p className="font-medium">{formData.foodCategory || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Food Style</p>
                    <p className="font-medium">{formData.foodStyle || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600 text-sm">Description</p>
                    <p className="font-medium">{formData.description || "No description provided"}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">Pickup Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Pickup Address</p>
                    <p className="font-medium">{formData.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Pincode</p>
                    <p className="font-medium">{formData.pincode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="font-medium">{formData.date || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Time</p>
                    <p className="font-medium">{formData.time || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Special Instructions</p>
                    <p className="font-medium">{formData.instructions || "None"}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <FaInfoCircle className="text-emerald-600 text-xl mr-3 mt-0.5" />
                  <div>
                    <p className="text-emerald-700 font-medium mb-1">What happens next?</p>
                    <p className="text-emerald-700">
                      Our team will review your donation and contact you to confirm the pickup. 
                      A volunteer will arrive at the scheduled time to collect the food.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition flex items-center disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaHandHoldingHeart className="mr-2" />
                      Submit Donation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-6 md:p-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center bg-emerald-100 p-6 rounded-full mb-6"
              >
                <FaCheck className="text-emerald-600 text-4xl" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Donation Submitted!</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Thank you for your generosity! Your donation has been received and our team will 
                contact you shortly to confirm pickup details. Together, we're making a difference.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      foodType: "",
                      quantity: "",
                      description: "",
                      address: "",
                      pincode: "",
                      date: "",
                      time: "",
                      instructions: "",
                      foodStyle: "Cooked Food",
                      foodCategory: "Veg"
                    });
                  }}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition"
                >
                  Make Another Donation
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-white border border-emerald-500 text-emerald-500 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Donation Impact Info */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Impact Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 mb-2">1M+</div>
                <p className="text-gray-700">Meals provided to those in need</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 mb-2">85%</div>
                <p className="text-gray-700">Reduction in food waste</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 mb-2">200+</div>
                <p className="text-gray-700">Communities served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;