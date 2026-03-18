import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaHeart, FaShieldAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const DonationModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order on Backend
      const { data: { order, donationId } } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/donation/create-order`,
        {
          amount: Number(amount),
          donorName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
          donorEmail: user?.email || "anonymous@example.com",
          userId: user?._id || null,
        },
        { withCredentials: true }
      );

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
        amount: order.amount,
        currency: order.currency,
        name: "FoodShare Donation",
        description: "Thank you for your contribution!",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify Payment on Backend
            const { data } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/donation/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (data.success) {
              toast.success("Thank you! Your donation was successful.");
              onClose();
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#10b981", // Emerald-500
        },
      };

      console.log("Razorpay Key ID used:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        toast.error("VITE_RAZORPAY_KEY_ID is missing in .env file!");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>

            {/* Header */}
            <div className="bg-emerald-500 p-8 text-center text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FaHeart className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold">Make a Donation</h2>
              <p className="text-emerald-100 mt-2">
                Your support helps us reach more people in need.
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Enter Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className={`py-2 rounded-lg border transition-all ${
                      amount === val.toString()
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                        : "border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-8">
                <FaShieldAlt className="text-emerald-500" />
                <span>Secure payment powered by Razorpay</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600 active:scale-95"
                }`}
              >
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
