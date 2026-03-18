import React, { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        { withCredentials: true }
      );

      logout(); // clear auth context

      navigate("/", { replace: true }); // force redirect

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-200 shadow-lg">
      <div className="h-20 flex justify-between items-center px-5 md:px-10">

        <h1 className="text-4xl md:text-5xl font-bold">FW</h1>

        <FaSignOutAlt
          className="text-3xl cursor-pointer hover:text-red-500"
          onClick={handleLogout}
        />

      </div>
    </div>
  );
};

export default Navbar;