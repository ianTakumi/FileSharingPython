import React, { useState, useRef } from "react";
import {
  getProfile,
  getUser,
  notifyError,
  notifySuccess,
  setProfile,
  setUser,
} from "../../../utils/Helpers";
import ChangePassword from "../../../components/User/Auth/Modals/ChangePassword";
import client from "../../../utils/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const user = getUser();
  const [profile, setProfileState] = useState(getProfile());
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      email: user.email || "",
    },
  });

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleDelete = async (userID) => {
    try {
      await client.delete(`/users/${userID}/`, { withCredentials: true });
      navigate("/"); // Redirect after successful deletion
      notifySuccess("Account successfully deleted");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        const response = await client.post(
          `/profile/change-picture/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        setProfileState({ ...profile, url: response.data.profile.url });
        setProfile(response.data);
        window.location.reload();
        notifySuccess("Profile picture updated!");
      } catch (error) {
        notifyError("Failed to update profile picture.");
      }
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (data) => {
    try {
      await client
        .put(`/users/${user.id}/`, data, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
        });
      notifySuccess("Profile updated successfully!");
    } catch (error) {
      notifyError("Failed to update profile.");
    }
  };

  return (
    <>
      <h1 className="font-bold font-sans text-2xl text-center mt-6 ">
        My Profile
      </h1>
      <div className="flex justify-center items-center mt-5 ">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 m-0 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <img
                src={profile.url}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-2 object-cover"
              />
              <i
                className="fi fi-tr-camera text-white bg-blue-500 rounded-full p-2 absolute bottom-2 left-1/2 transform -translate-x-1/2 text-base shadow-lg cursor-pointer"
                onClick={openFileExplorer}
              ></i>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
              onClick={handleOpenPasswordModal}
            >
              Change Password
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mt-2"
            >
              Delete Account
            </button>
          </div>

          {/* Right Column */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="mb-4">
              <label htmlFor="first_name" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                {...register("first_name", {
                  required: "First name is required",
                })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
              {errors.first_name && (
                <p className="text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="last_name" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
              {errors.last_name && (
                <p className="text-red-500">{errors.last_name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                {...register("username", { required: "Username is required" })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                className="w-full border rounded px-2 py-1 mt-1"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            {/* Update Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {isPasswordModalOpen && (
        <ChangePassword
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
        />
      )}
    </>
  );
};

export default Profile;
