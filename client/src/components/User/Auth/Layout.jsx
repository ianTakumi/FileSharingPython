import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed width on larger screens */}
      <div>
        <Sidebar />
      </div>

      {/* Main content - Full width minus the Sidebar */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main
          className="p-4 h-full overflow-auto"
          style={{ backgroundColor: "#F0F1F6" }}
        >
          <Outlet />
        </main>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            z-index: 10;
            width: 250px; /* Adjust this to your preferred width */
            background: white; /* Background for sidebar */
            height: 100%; /* Full height */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional shadow */
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
