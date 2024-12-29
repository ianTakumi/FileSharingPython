import React, { useState } from "react";
import { Menu } from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, NavLink } from "react-router-dom";
import { logout, getUser, getProfile } from "../../../utils/Helpers";
import Swal from "sweetalert2";
import client from "../../../utils/client";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Joyride from "react-joyride";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const user = getUser();
  const profile = getProfile();
  const [run, setRun] = useState(false);

  // Tour steps
  const steps = [
    {
      target: ".help-button", // Target the Help button
      content: "Click here to get help!",
    },
    {
      target: ".profile-button",
      content:
        "Here is your profile where you can click your profile or logout",
    },
    {
      target: ".sidebar-dashboard",
      content: "Here is your sidebar where you can access various resources",
    },
    {
      target: ".main-dashboard",
      content: "Here is a button to redirect you to your dashboard",
    },
    {
      target: ".users",
      content: "Here is a button to redirect you to the users page list",
    },
    {
      target: ".contacts",
      content: "Here is a button to redirect you to the contacts page list",
    },
    {
      target: ".profile",
      content: "Here is a button to redirect you to your profile page",
    },
    {
      target: ".logout",
      content: "Here is a button you can use to logout",
    },
  ];

  const handleHelpClick = () => {
    setRun(true);
    setTimeout(() => setRun(true), 200);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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
        // Handle logout failure
        Swal.fire("Error", "Failed to log out. Please try again.", "error");
      }
    }

    // Close the profile dropdown after logout
    setIsProfileDropdownOpen(false);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav
      className="text-white flex items-center py-2 px-4"
      style={{ backgroundColor: "#FAFAFB" }}
    >
      <div className="flex items-center justify-center">
        {/* Menu Icon */}
        <button onClick={toggleSidebar} className="text-black mr-4">
          <Menu
            style={{ fontSize: "15px" }}
            className="text-gray-400 mb-1 ml-2"
          />
        </button>
      </div>
      <div className="ml-auto flex items-center w-full">
        {/* Right Side Icons */}
        <div className="flex items-center ml-auto space-x-4">
          <button className="text-black help-button" onClick={handleHelpClick}>
            <HelpOutlineIcon />
          </button>
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="text-black flex items-center profile-button gap-3"
            >
              <img
                src={profile.url}
                alt="User Profile Pic"
                className="rounded-full w-10 h-10 object-cover"
              />
              <span>{user.first_name + " " + user.last_name}</span>
              <KeyboardArrowDownOutlinedIcon style={{ fontSize: "15px" }} />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                <NavLink to={"/admin/profile"} onClick={closeProfileDropdown}>
                  <button className="flex gap-4 px-4 py-3 text-gray-700 justify-between hover:bg-gray-100 w-full text-left">
                    <span className="text-gray-700">Profile</span>
                    <PersonOutlineOutlinedIcon style={{ fontSize: "18px" }} />
                  </button>
                </NavLink>

                <button
                  className="flex gap-4 px-4 py-3 text-gray-700 justify-between hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  <span className="text-gray-700">Logout</span>
                  <LogoutOutlinedIcon style={{ fontSize: "18px" }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        spotlightClicks={true}
        callback={(data) => {
          const { status, step, action } = data;
          if (status === "finished" || status === "skipped") {
            setRun(false); // Stop the tour once it's finished or skipped
          }

          // Check if the action is moving to the step targeting the dashboard
          if (step.target === ".dashboard" && action === "next") {
            navigate("/admin"); // Redirect to the dashboard page
          }
        }}
        styles={{
          options: {
            zIndex: 10000, // Ensure it appears above other elements
          },
        }}
      />
    </nav>
  );
};

export default Navbar;
