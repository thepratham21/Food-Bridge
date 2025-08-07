import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Home = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]); // Store accepted orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  // Fetch accepted orders for the selected volunteer
  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/order/volunteer/orders", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch accepted orders.");

        console.log("Fetched Accepted Orders:", data.orders); // Log the fetched data
        setAcceptedOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
  }, []);

  // Handle completing the order
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/order/complete", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to complete order.");
      alert("Order marked as completed!");
      setAcceptedOrders(acceptedOrders.filter(order => order._id !== orderId)); // Remove completed order from list
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen min-h-screen overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Accepted Orders</h2>
        
        {/* History Button */}
        <button
          onClick={() => navigate("/history")} // Navigate to the /history page
          className="absolute top-25 right-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          History
        </button>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {acceptedOrders.length === 0 && <p className="text-center text-gray-500">No accepted orders.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedOrders.map((order) => (
            <div key={order._id} className="p-4 border rounded-lg shadow-lg bg-white">
              <h3 className="text-lg font-semibold">{order.userId.firstName} {order.userId.lastName}</h3>
              <p className="text-sm text-gray-600">
                Receiver: {order.ngoId ? `${order.ngoId.firstName} ${order.ngoId.lastName}` : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Receiver address: {order.ngoId ? order.ngoId.address : "N/A"}
              </p>
              <p className="text-sm text-gray-600">Food: {order.foodDetails}</p>
              <p className="text-sm text-gray-600">Address: {order.address}</p>
              <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
              <p className="mt-2 text-gray-800">
                Status: <span className="text-green-500 font-semibold">{order.status}</span>
              </p>
              <button
                onClick={() => handleCompleteOrder(order._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
