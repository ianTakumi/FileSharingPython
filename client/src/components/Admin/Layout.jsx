import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

const Layout = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex">
      <Sidebar isMinimized={isSidebarMinimized} />
      <div className="flex flex-col w-full">
        <Navbar toggleSidebar={toggleSidebar} />
        <main
          className="p-4 h-screen overflow-auto "
          style={{ backgroundColor: "#F0F1F6" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
