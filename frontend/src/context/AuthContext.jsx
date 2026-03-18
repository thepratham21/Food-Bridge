import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          { withCredentials: true }
        );

        const userData = response.data.user || response.data;

        setUser(userData);
        setIsAuthenticated(true);
        setRole(userData.role?.toLowerCase());

      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role?.toLowerCase());
  };

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Logout error:", error);
    }

    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};