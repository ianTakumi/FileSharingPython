import React, { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../utils/Helpers";
import client from "../../../utils/client";
import Swal from "sweetalert2";

const Sidebar = ({ isMinimized }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelected(item);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    });

    if (result.isConfirmed) {
      try {
        await client.post(`/logout/`);
        logout();
        navigate("/");
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "Failed to log out. Please try again.", "error");
      }
    }
  };

  return (
    <div className="relative">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative bg-white text-white overflow-hidden ${
          isMinimized ? "w-20" : "w-80"
        }`}
      >
        {!isMinimized && (
          <div className="p-4 text-xl font-bold font-serif flex flex-row justify-center items-center -ml-2 text-black">
            <img
              src="/images/logo.png"
              alt="FileGuard"
              className="w-8 h-auto mr-3"
            />
            FileGuard
          </div>
        )}
        {isMinimized && (
          <div className="p-4 flex justify-center items-center">
            <img
              src="/images/logoTransparent.png"
              alt="FileGuard"
              className="ml-6"
            />
          </div>
        )}

        <ul className="mt-5 text-xs">
          <Link to="/admin">
            <li
              className="sidebar-dashboard mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
              onMouseOver={() => setHovered("dashboard")}
              onMouseOut={() => setHovered(null)}
              onClick={() => handleItemClick("dashboard")}
              style={{
                backgroundColor:
                  hovered === "dashboard" || selected === "dashboard"
                    ? "#D9DDE8"
                    : "transparent",
              }}
            >
              <DashboardIcon
                style={{
                  color: "#605BFF",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
              <span
                className={`transition-all ease-in-out duration-500 ${
                  isMinimized ? "hidden" : "block"
                }`}
                style={{
                  fontSize: "16px",
                  color:
                    hovered === "dashboard" || selected === "dashboard"
                      ? "#A1A1AC"
                      : "#605BFF",
                }}
              >
                Dashboard
              </span>
            </li>
          </Link>

          <Link to="/admin/users">
            <li
              className="users mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
              onMouseOver={() => setHovered("users")}
              onMouseOut={() => setHovered(null)}
              onClick={() => handleItemClick("users")}
              style={{
                backgroundColor:
                  hovered === "users" || selected === "users"
                    ? "#D9DDE8"
                    : "transparent",
              }}
            >
              <GroupIcon
                style={{
                  color: "#605BFF",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
              <span
                className={`text-gray-500 transition-all ease-in-out duration-500 ${
                  isMinimized ? "hidden" : "block"
                }`}
                style={{
                  fontSize: "16px",
                  color:
                    hovered === "dashboard" || selected === "dashboard"
                      ? "#A1A1AC"
                      : "#605BFF",
                }}
              >
                Users
              </span>
            </li>
          </Link>

          <Link to="/admin/contacts">
            <li
              className="contacts mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
              onMouseOver={() => setHovered("contacts")}
              onMouseOut={() => setHovered(null)}
              onClick={() => handleItemClick("contacts")}
              style={{
                backgroundColor:
                  hovered === "contacts" || selected === "contacts"
                    ? "#D9DDE8"
                    : "transparent",
              }}
            >
              <PhoneIcon
                style={{
                  color: "#605BFF",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
              <span
                className={`text-gray-500 transition-all ease-in-out duration-500 ${
                  isMinimized ? "hidden" : "block"
                }`}
                style={{
                  fontSize: "16px",
                  color:
                    hovered === "dashboard" || selected === "dashboard"
                      ? "#A1A1AC"
                      : "#605BFF",
                }}
              >
                Contacts
              </span>
            </li>
          </Link>

          <h1
            className={`text-gray-400 font-sans px-8 pt-1 ${
              isMinimized ? "hidden" : "block"
            }`}
          >
            User
          </h1>

          <Link to="profile">
            <li
              className="profile mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
              onMouseOver={() => setHovered("profile")}
              onMouseOut={() => setHovered(null)}
              onClick={() => handleItemClick("profile")}
              style={{
                backgroundColor:
                  hovered === "profile" || selected === "profile"
                    ? "#D9DDE8"
                    : "transparent",
              }}
            >
              <PersonIcon
                style={{
                  color: "#605BFF",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
              <span
                className={`text-gray-500 transition-all ease-in-out duration-500 ${
                  isMinimized ? "hidden" : "block"
                }`}
                style={{
                  fontSize: "16px",
                  color:
                    hovered === "dashboard" || selected === "dashboard"
                      ? "#A1A1AC"
                      : "#605BFF",
                }}
              >
                Profile
              </span>
            </li>
          </Link>

          <li
            className="logout mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("logout")}
            onMouseOut={() => setHovered(null)}
            onClick={handleLogout}
            style={{
              backgroundColor:
                hovered === "logout" || selected === "logout"
                  ? "#D9DDE8"
                  : "transparent",
            }}
          >
            <LogoutIcon
              style={{ color: "#5A6AFF", fontSize: "1.7rem", lineHeight: "1" }}
              className="p-1"
            />
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "dashboard" || selected === "dashboard"
                    ? "#A1A1AC"
                    : "#605BFF",
              }}
            >
              Logout
            </span>
          </li>
        </ul>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
