import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Navbars
import UserNavbar from "./user/pages/Navbar";

// Landing Page
import HomePage from "./HomePage";

// USER pages
import UserHome from "./user/pages/Home";
import UserLogin from "./user/pages/Login";
import Order from "./user/pages/Order";
import UserHistory from "./user/pages/History";
import DonatePage from "./user/pages/DonatePage";
import Profile from "./user/pages/Profile";
import UserSignUp from "./user/pages/SignIn";

// NGO pages
import NGOHome from "./NGO/pages/Home";
import NGOLogin from "./NGO/pages/Login";
import NGOHistory from "./NGO/pages/History";
import NGOSignUp from "./NGO/pages/SignUp";

// VOLUNTEER pages
import VolunteerHome from "./Volunteer/pages/Home";
import VolunteerLogin from "./Volunteer/pages/Login";
import VolunteerHistory from "./Volunteer/pages/History";
import VolunteerSignUp from "./Volunteer/pages/SignUp";


import { Toaster } from "react-hot-toast";

function App() {

  const { isAuthenticated, role, authLoading } = useContext(AuthContext);

  // ================= NAVBAR HANDLER =================
  const renderNavbar = () => {
    if (!isAuthenticated) return null;

    switch (role) {
      case "user":
        return <UserNavbar />;
      default:
        return null;
    }
  };


  // ================= PROTECTED ROUTE =================
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600"></div>
            <p className="text-emerald-700 font-bold">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to={`/${allowedRole}/login`} />;
    }

    if (role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {renderNavbar()}

      <Routes>

        {/* ================= LANDING ================= */}
        <Route path="/" element={<HomePage />} />



        {/* ================= USER ROUTES ================= */}

        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signin" element={<UserSignUp />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/order"
          element={
            <ProtectedRoute allowedRole="user">
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/history"
          element={
            <ProtectedRoute allowedRole="user">
              <UserHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/" />
          }
        />

        <Route
          path="/user/donate"
          element={
            <ProtectedRoute allowedRole="user">
              <DonatePage />
            </ProtectedRoute>
          }
        />



        {/* ================= NGO ROUTES ================= */}

        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/signup" element={<NGOSignUp />} />

        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRole="ngo">
              <NGOHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/history"
          element={
            <ProtectedRoute allowedRole="ngo">
              <NGOHistory />
            </ProtectedRoute>
          }
        />



        {/* ================= VOLUNTEER ROUTES ================= */}

        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        <Route path="/volunteer/signup" element={<VolunteerSignUp />} />

        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/history"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerHistory />
            </ProtectedRoute>
          }
        />



        {/* ================= OLD ROUTE SUPPORT ================= */}

        <Route path="/donate" element={<Navigate to="/user/donate" />} />
        <Route path="/history" element={<Navigate to="/user/history" />} />

        <Route path="/login" element={<Navigate to="/user/login" />} />
        <Route path="/signin" element={<Navigate to="/user/signin" />} />

        <Route path="/ngoSignUp" element={<Navigate to="/ngo/signup" />} />
        <Route path="/ngoHistory" element={<Navigate to="/ngo/history" />} />

        <Route path="/volunteerSignUp" element={<Navigate to="/volunteer/signup" />} />
        <Route path="/volunteerHistory" element={<Navigate to="/volunteer/history" />} />



        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}

export default App;