import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";
import { FiClock, FiUser, FiMapPin, FiPackage, FiLogOut } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";

const Home = () => {
  const { user, setUser } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/order/ngo/orders",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch orders.");
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/user/volunteers",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch volunteers.");
        setVolunteers(data.volunteers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    fetchVolunteers();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setSelectedVolunteer("");
  };

  const handleAcceptOrder = async () => {
    if (!selectedVolunteer) return alert("Please select a volunteer!");

    try {
      const userId = user?._id;
      if (!userId) return alert("User not authenticated.");

      const response = await fetch(
        "http://localhost:4000/api/v1/order/accept",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: selectedOrder._id,
            volunteerId: selectedVolunteer,
            userId: userId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to accept order.");

      alert("Order accepted successfully!");
      setSelectedOrder(null);
      setSelectedVolunteer(null); // optional: reset volunteer selection

      // 🔄 Refresh orders
      const refreshResponse = await fetch(
        "http://localhost:4000/api/v1/order/ngo/orders",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const refreshData = await refreshResponse.json();
      if (!refreshResponse.ok)
        throw new Error(
          refreshData.message || "Failed to fetch updated orders."
        );
      setOrders(refreshData.orders);
    } catch (err) {
      console.error("Accept Order Error:", err);
      alert(err.message || "Something went wrong.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });

      // Clear user context and redirect to HOME PAGE
      setUser(null);
      navigate("/"); // CORRECTED: Redirect to home page instead of login
      window.location.reload(); // <== Force reload to reflect logout state
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <TbTruckDelivery className="mr-2" />
            FoodShare NGO Dashboard
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center bg-white text-emerald-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
            >
              <FiClock className="mr-2" />
              History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-emerald-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-emerald-400 to-teal-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connecting Surplus Food with Those in Need
            </h1>
            <p className="text-white text-lg max-w-2xl">
              Manage food donation requests and coordinate with volunteers
              efficiently
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Dashboard Stats */}
      <div className="container mx-auto -mt-8 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold mt-2">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">
              Available Volunteers
            </h3>
            <p className="text-3xl font-bold mt-2">{volunteers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500">
            <h3 className="text-gray-500 text-sm font-medium">
              Completed Today
            </h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiPackage className="mr-2 text-emerald-600" />
            Pending Food Requests
          </h2>
          <div className="text-sm text-gray-500">
            {orders.length} requests found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No pending requests
            </h3>
            <p className="text-gray-500">
              All food donations have been assigned!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 flex items-center">
                        <FiUser className="mr-2 text-emerald-600" />
                        {order.userId.firstName} {order.userId.lastName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin className="mr-1" />
                        Pincode: {order.userId.pincode}
                      </div>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {order.quantity} servings
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700">{order.foodDetails}</p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Popup */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-emerald-600 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <FiPackage className="mr-2" />
                Order Details
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Donor
                  </label>
                  <p className="font-medium">
                    {selectedOrder.userId.firstName}{" "}
                    {selectedOrder.userId.lastName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Food Details
                    </label>
                    <p>{selectedOrder.foodDetails}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Quantity
                    </label>
                    <p>{selectedOrder.quantity} servings</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Pickup Location
                  </label>
                  <p className="flex items-center">
                    <FiMapPin className="mr-1 text-emerald-600" />
                    Pincode: {selectedOrder.userId.pincode}
                  </p>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Volunteer
                  </label>

                  {volunteers.length === 0 ? (
                    <div className="text-center py-4 border border-dashed rounded-lg">
                      <p className="text-gray-500">No available volunteers</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {volunteers.map((vol) => (
                        <div
                          key={vol._id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedVolunteer === vol._id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                          onClick={() => setSelectedVolunteer(vol._id)}
                        >
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                            <FiUser className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {vol.firstName} {vol.lastName}
                              {selectedVolunteer === vol._id && (
                                <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  Selected
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiMapPin className="mr-1" />
                              Pincode: {vol.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptOrder}
                  disabled={!selectedVolunteer || volunteers.length === 0}
                  className={`flex items-center px-5 py-2.5 text-white rounded-lg font-medium ${
                    selectedVolunteer && volunteers.length > 0
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Assign Volunteer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
