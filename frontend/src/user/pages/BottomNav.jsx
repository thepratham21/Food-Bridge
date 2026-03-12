import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaShoppingCart, FaHistory, FaUser } from "react-icons/fa";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around py-3 overflow-hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center text-gray-500 ${
            isActive ? "text-blue-500 font-semibold" : ""
          }`
        }
      >
        <FaHome className="text-2xl" />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink
        to="/order"
        className={({ isActive }) =>
          `flex flex-col items-center text-gray-500 ${
            isActive ? "text-blue-500 font-semibold" : ""
          }`
        }
      >
        <FaShoppingCart className="text-2xl" />
        <span className="text-xs">Order</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex flex-col items-center text-gray-500 ${
            isActive ? "text-blue-500 font-semibold" : ""
          }`
        }
      >
        <FaHistory className="text-2xl" />
        <span className="text-xs">History</span>
      </NavLink>

     
    </div>
  );
};

export default BottomNav;
