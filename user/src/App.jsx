import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Order from './pages/Order';
import History from './pages/History';

import BottomNav from './pages/BottomNav';
// Import the context
import { Context } from './main';
import Navbar from './pages/Navbar';
import DonatePage from './pages/DonatePage';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/user/me',{ withCredentials: true });
        setIsAuthenticated(true);
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({}); // If the user is not authenticated, reset user data
      }
    };

    fetchUser(); // Fetch user data when the app loads
  }, [setIsAuthenticated, setUser]);

  return (
    <Router>
       {/* {isAuthenticated && <BottomNav />}Render BottomNav only if authenticated */}
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/order" element={isAuthenticated ? <Order /> : <Login/>} />
        <Route path="/history" element={isAuthenticated ? <History /> : <Login/>} />
        

        {/* Public routes */}
        <Route path="/donate"  element={<DonatePage/>}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;
