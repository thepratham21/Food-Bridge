import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiClock, FiUser, FiMapPin, FiPackage, FiLogOut } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [volunteerError, setVolunteerError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

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
        setVolunteerError("");
      } catch (err) {
        console.error(err);
        setVolunteerError(err.message);
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
      const userId = user?._id || user?.id; // Handle both _id and id
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
      setSelectedVolunteer("");

      // Refresh orders
      const refreshResponse = await fetch(
        "http://localhost:4000/api/v1/order/ngo/orders",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const refreshData = await refreshResponse.json();
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

      logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <TbTruckDelivery className="mr-2" />
            FoodShare NGO Dashboard
          </h1>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/ngo/history")}
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

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-emerald-400 to-teal-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connecting Surplus Food with Those in Need
            </h1>
            <p className="text-white text-lg max-w-2xl">
              Manage food donation requests and coordinate with volunteers efficiently
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto -mt-8 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
            <p className="text-3xl font-bold mt-2">{orders.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Available Volunteers</h3>
            <p className="text-3xl font-bold mt-2">{volunteers.length}</p>
            {volunteerError && (
              <p className="text-red-500 text-xs mt-1">{volunteerError}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500">
            <h3 className="text-gray-500 text-sm font-medium">Completed Today</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
          <FiPackage className="mr-2 text-emerald-600" />
          Pending Food Requests
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-t-2 border-emerald-500 rounded-full"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border cursor-pointer hover:shadow-lg transition"
                onClick={() => handleOrderClick(order)}
              >
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center">
                    <FiUser className="mr-2 text-emerald-600" />
                    {order.userId?.firstName} {order.userId?.lastName}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiMapPin className="mr-1" />
                    Pincode: {order.userId?.pincode || "N/A"}
                  </div>

                  <p className="mt-4 text-gray-700 line-clamp-2">{order.foodDetails}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      {order.quantity || "?"} servings
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

      {/* Volunteer Selection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Assign Volunteer</h3>
            <p className="mb-2">
              <span className="font-medium">From:</span> {selectedOrder.userId?.firstName}{" "}
              {selectedOrder.userId?.lastName}
            </p>
            <p className="mb-4 text-gray-600">{selectedOrder.foodDetails}</p>

            <label className="block mb-2 font-medium">Select Volunteer</label>
            <select
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">-- Choose a volunteer --</option>
              {volunteers.map((vol) => (
                <option key={vol._id} value={vol._id}>
                  {vol.firstName} {vol.lastName} ({vol.email})
                </option>
              ))}
            </select>

            {volunteerError && (
              <p className="text-red-500 text-sm mb-4">{volunteerError}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptOrder}
                disabled={!selectedVolunteer}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                Accept & Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;