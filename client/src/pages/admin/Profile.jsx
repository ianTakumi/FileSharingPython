import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "react-toastify/dist/ReactToastify.css";
import { getUser, getProfile } from "../../utils/Helpers";
import ProfileModal from "../../components/Admin/Modal/Profile";
import ChangePasswordModal from "../../components/Admin/Modal/ChangePasswordModal";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const user = getUser();
  const profile = getProfile();
  const navigate = useNavigate();

  const handleEditProfile = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);
  const redirect_home = () => navigate("/admin");
  const redirect_profile = () => navigate("/admin/profile");

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-serif">
          Admin Profile
        </h1>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={redirect_home}
          >
            Home
          </span>
          /
          <span
            className="cursor-pointer hover:underline"
            onClick={redirect_profile}
          >
            Profile
          </span>
        </p>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        {/* Profile Image */}
        <img
          src={profile.url}
          alt="Profile"
          className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover"
        />

        {/* User Details and Actions */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-lg">
            <h2 className="text-xl md:text-2xl font-semibold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600 mt-1">
              {user?.email || "admin@example.com"}
            </p>
            <p className="text-gray-600 font-semibold capitalize mt-1">
              Administrator
            </p>
          </div>
          {/* Action Buttons */}
          <button
            onClick={handleEditProfile}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <EditOutlinedIcon /> <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Centered and Larger Profile Details */}
      <div className="mt-12 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 w-full max-w-md md:max-w-lg">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 gap-4 text-gray-700">
            <p>
              <strong>First Name:</strong> {user.first_name || "N/A"}
            </p>
            <p>
              <strong>Last Name:</strong> {user.last_name || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {user.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
          </div>
          {/* Change Password Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleOpenPasswordModal}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={user}
        />
      )}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
        />
      )}
    </div>
  );
};

export default Profile;
