import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

import History from './pages/History';


// Import the context
import { Context } from './main';
import Navbar from './pages/Navbar';

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/user/me',{ withCredentials: true });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({}); // If the user is not authenticated, reset user data
      }
    };

    fetchUser(); // Fetch user data when the app loads
  }, [setIsAuthenticated, setUser]);

  return (
    <Router>
      
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/history" element={isAuthenticated ? <History /> : <Login/>} />
        {/* Public routes */}
        <Route path="/signUp" element={<SignUp />} />
       
      </Routes>
    </Router>
  );
}

export default App;
