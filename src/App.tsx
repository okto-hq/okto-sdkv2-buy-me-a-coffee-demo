/** @format */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("bmac_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Router>
      <div className="font-poppins">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
