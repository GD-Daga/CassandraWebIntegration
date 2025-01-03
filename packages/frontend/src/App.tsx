import React, { useState, useEffect } from "react"; // Added useEffect import
import Navbar from "./components/Navbar";
import SideNavbar from "./components/SideNavbar";
import Homepage from "./pages/Homepage";
import CatholicChurches from "./components/quick-links/CatholicChurches";
import DistrictMap from "./pages/DistrictMap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Add Routes for navigation
import 'leaflet/dist/leaflet.css';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Close sidebar when user scrolls
      if (isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSidebarOpen]);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <SideNavbar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 bg-gray-100 overflow-auto">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/catholic-churches" element={<CatholicChurches />} />
              <Route path="/district-map" element={<DistrictMap />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
