import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import client from "../../utils/client"; // Your API client utility
import { notifyError, notifySuccess } from "../../utils/Helpers"; // Notification utility
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const token = pathSegments[pathSegments.length - 2]; // Last segment
    console.log(pathSegments);
    if (token) {
      // Validate the token by decoding and checking its expiration
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token has expired
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setIsTokenValid(true);
          setUserId(decodedToken.user_id); // Assuming user_id is in the token payload
        } else {
          notifyError("Token has expired."); // Notify user of expiration
        }
      } catch (error) {
        notifyError("Invalid token."); // Notify user of invalid token
      }
    }
  }, []);

  const onSubmit = async (data) => {
    const { password, confirm_password } = data;

    // Check if passwords match
    if (password === confirm_password) {
      try {
        // Send new password to your API
        const response = await client.post(`/reset-password/`, {
          user_id: userId, // User ID from the token
          password: password, // New password
        });
        notifySuccess(response.data.message); // Notify success
        navigate("/signin");
      } catch (error) {
        notifyError("Failed to change password."); // Notify error
      }
    } else {
      notifyError("Passwords do not match."); // Notify mismatch
    }
  };

  if (!isTokenValid) {
    return <div>Validating token...</div>; // Show loading or validation message
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              {...register("confirm_password", {
                required: "Confirm Password is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
