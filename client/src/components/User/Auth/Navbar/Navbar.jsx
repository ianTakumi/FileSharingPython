import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import client from "../../../../utils/client";
import {
  notifyError,
  notifySuccess,
  logout,
  getProfile,
} from "../../../../utils/Helpers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Joyride from "react-joyride";

const Navbar = () => {
  const profile = getProfile();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const [run, setRun] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      // Redirect to search results with query parameter `q`
      navigate(
        `/drive/search-results/${encodeURIComponent(
          searchQuery
        )}?q=${encodeURIComponent(searchQuery)}`
      );
    }
  };

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
      target: ".sidebar",
      content: "Here is your sidebar where you can access various resources",
    },
    {
      target: ".new",
      content: "Here is a button you can use to upload files",
    },
    {
      target: ".main-dashboard",
      content: "Here is a button to redirect you to your dashboard",
    },
    {
      target: ".myDrive",
      content: "Here is a button to redirect you to the users page list",
    },
    {
      target: ".shared",
      content: "Here is a button to redirect you to the shared files page",
    },
    {
      target: ".totalspace",
      content: "Here you can see the available space for your drive",
    },
  ];

  const handleHelpClick = () => {
    setRun(true);
    setTimeout(() => setRun(true), 200);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate("/drive/profile");
  };

  const handleLogoutClick = () => {
    const url = `/logout/`;
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await client.post(url, { withCredentials: true }).then((response) => {
            if (response.status === 200) {
              notifySuccess("Logout Successfully");
              logout();
              navigate("/signin");
            }
          });
        } catch (err) {
          notifyError("Something went wrong.");
          console.error(err);
        }
      }
    });
  };

  return (
    <>
      <nav
        style={{
          padding: "10px",
          backgroundColor: "#f1f3f4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Hamburger Menu for Mobile View */}
        <IconButton
          onClick={toggleMenu}
          style={{ display: "none", marginRight: "10px" }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            backgroundColor: "white",
            padding: "5px 15px",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <SearchIcon style={{ marginRight: "8px", color: "gray" }} />
          <input
            type="text"
            placeholder="Search in Drive"
            onChange={handleSearchChange} // Update search query
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit(); // Submit search on Enter
            }}
            style={{
              border: "none",
              outline: "none",
              flexGrow: 1,
              backgroundColor: "transparent",
            }}
          />
        </div>

        {/* User Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={handleHelpClick} className="help-button">
            <HelpOutlineIcon style={{ color: "gray", cursor: "pointer" }} />
          </button>
          <div style={{ position: "relative" }} className="profile-button">
            <img
              src={profile.url}
              alt="User Avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  width: "150px",
                }}
              >
                <div
                  onClick={handleProfileClick}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  Profile
                </div>
                <div
                  onClick={handleLogoutClick}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu (for demonstration purposes, adjust as needed) */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px", // Adjust based on navbar height
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "200px",
          }}
        >
          <div
            onClick={handleProfileClick}
            style={{ padding: "10px 15px", cursor: "pointer" }}
          >
            Profile
          </div>
          <div
            onClick={handleLogoutClick}
            style={{ padding: "10px 15px", cursor: "pointer" }}
          >
            Logout
          </div>
        </div>
      )}

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
    </>
  );
};

export default Navbar;
