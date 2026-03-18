import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiClock,
  FiUser,
  FiMapPin,
  FiPackage,
  FiLogOut,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { FaHandHoldingHeart, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch accepted orders
  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/order/volunteer/orders`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch accepted orders.");

        setAcceptedOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    setCompleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/order/complete`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to complete order.");

      alert("Order marked as completed!");
      setAcceptedOrders(acceptedOrders.filter((order) => order._id !== orderId));
      setModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Stats calculations
  const completedToday = acceptedOrders.filter((order) => {
    const today = new Date().toDateString();
    return (
      order.status === "completed" &&
      order.completedAt &&
      new Date(order.completedAt).toDateString() === today
    );
  }).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <TbTruckDelivery className="mr-2" />
            FoodShare Volunteer
          </h1>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/volunteer/history")}
              className="flex items-center bg-white text-emerald-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition shadow-sm"
            >
              <FiClock className="mr-2" />
              History
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-emerald-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition shadow-sm"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Your Active Deliveries
            </h1>
            <p className="text-emerald-100 text-md max-w-2xl">
              Click on any delivery to view details and complete the task
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto -mt-8 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <h3 className="text-gray-500 text-sm font-medium">Assigned to You</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-600">
              {acceptedOrders.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Completed Today</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {completedToday}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500">
            <h3 className="text-gray-500 text-sm font-medium">Your Impact</h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">
              {acceptedOrders.reduce((sum, o) => sum + (o.quantity || 0), 0)} meals
            </p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
          <FaHandHoldingHeart className="mr-2 text-emerald-600" />
          Your Deliveries
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-t-2 border-emerald-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-red-500">{error}</p>
          </div>
        ) : acceptedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No active deliveries. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                onClick={() => openModal(order)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <TbTruckDelivery className="text-emerald-600 text-xl" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                      {order.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMapPin className="mr-1 text-emerald-500" />
                    {order.userId?.address?.slice(0, 30)}...
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {order.foodDetails}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Qty: {order.quantity} servings</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-50 px-6 py-3 text-emerald-700 text-sm font-medium group-hover:bg-emerald-100 transition">
                  Click to view details →
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {modalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">Delivery Details</h2>
                  <button
                    onClick={closeModal}
                    className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
                <p className="text-emerald-100 mt-1">
                  Order ID: {selectedOrder._id.slice(-8)}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Receiver Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiUser className="mr-2 text-emerald-600" />
                    Receiver Information
                  </h3>
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <p className="font-medium text-gray-800">
                      {selectedOrder.userId?.firstName}{" "}
                      {selectedOrder.userId?.lastName}
                    </p>
                    <p className="text-gray-600 flex items-start mt-2">
                      <FiMapPin className="mr-2 mt-1 text-emerald-600 flex-shrink-0" />
                      <span>{selectedOrder.userId?.address || "Address not provided"}</span>
                    </p>
                    {selectedOrder.userId?.phone && (
                      <p className="text-gray-600 flex items-center mt-2">
                        <FaPhone className="mr-2 text-emerald-600" />
                        {selectedOrder.userId.phone}
                      </p>
                    )}
                    {/* Directions Button */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedOrder.userId?.address || ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Food Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiPackage className="mr-2 text-emerald-600" />
                    Food Details
                  </h3>
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-gray-800">{selectedOrder.foodDetails}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Quantity: {selectedOrder.quantity} servings
                    </p>
                  </div>
                </div>

                {/* Assigned Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiClock className="mr-2 text-emerald-600" />
                    Assignment Info
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-gray-600">
                      Assigned on:{" "}
                      {new Date(
                        selectedOrder.assignedAt || selectedOrder.createdAt
                      ).toLocaleString()}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Status:{" "}
                      <span className="font-semibold text-emerald-600">
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Complete Button */}
                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleCompleteOrder(selectedOrder._id)}
                    disabled={completing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center disabled:opacity-50"
                  >
                    {completing ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2 text-xl" />
                        Mark as Completed
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;